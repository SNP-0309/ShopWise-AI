const cron = require('node-cron');
const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { searchProducts } = require('../services/marketplace/searchService');
const { sendPriceAlertEmail } = require('../utils/emailService');

/**
 * Checks all active price alerts and notifies users when the target price is met.
 * Runs every hour.
 */
const startPriceAlertCron = (io) => {
  // Run at the top of every hour
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ [CronJob] Checking price alerts...');

    try {
      // Only fetch active alerts that haven't been triggered yet
      const alerts = await Alert.find({ isActive: true, triggered: false }).lean();

      if (!alerts || alerts.length === 0) {
        console.log('ℹ️ [CronJob] No active alerts to check.');
        return;
      }

      console.log(`🔍 [CronJob] Checking ${alerts.length} alert(s)...`);

      for (const alert of alerts) {
        try {
          // Search for current price of this product
          const { products } = await searchProducts(alert.productName, {});
          if (!products || products.length === 0) continue;

          // Find the best (lowest) price across all store listings
          let bestPrice = Infinity;
          let bestStore = alert.store;

          for (const product of products) {
            if (product.storeListings) {
              for (const listing of product.storeListings) {
                if (listing.price < bestPrice) {
                  bestPrice = listing.price;
                  bestStore = listing.store;
                }
              }
            }
          }

          if (bestPrice === Infinity) continue;

          // Check if current price is at or below target
          if (bestPrice <= alert.targetPrice) {
            console.log(`🎉 [CronJob] Alert triggered for user ${alert.user}: ${alert.productName} @ ₹${bestPrice}`);

            // Mark alert as triggered so it doesn't fire again
            await Alert.findByIdAndUpdate(alert._id, {
              isActive: false,
              triggered: true,
              triggeredAt: new Date(),
              triggeredPrice: bestPrice,
            });

            // Create in-app notification
            const notification = await Notification.create({
              user: alert.user,
              type: 'price_drop',
              message: `🎉 Price drop! "${alert.productName}" is now ₹${bestPrice.toLocaleString('en-IN')} on ${bestStore} — your target was ₹${alert.targetPrice.toLocaleString('en-IN')}`,
              read: false,
              meta: {
                productId: alert.productId,
                productName: alert.productName,
                store: bestStore,
                currentPrice: bestPrice,
                targetPrice: alert.targetPrice,
              },
            });

            // Emit real-time notification via Socket.io
            if (io) {
              io.to(`user-${alert.user}`).emit('notification', {
                type: 'price_drop',
                message: notification.message,
                productName: alert.productName,
                currentPrice: bestPrice,
                targetPrice: alert.targetPrice,
              });
            }

            // Send email notification
            try {
              const user = await User.findById(alert.user).lean();
              if (user?.email) {
                await sendPriceAlertEmail(user.email, {
                  productName: alert.productName,
                  currentPrice: bestPrice,
                  targetPrice: alert.targetPrice,
                  productImage: alert.productImage,
                  store: bestStore,
                });
              }
            } catch (emailErr) {
              console.warn('⚠️ [CronJob] Email failed (non-fatal):', emailErr.message);
            }
          }
        } catch (alertErr) {
          console.error(`❌ [CronJob] Error processing alert ${alert._id}:`, alertErr.message);
        }
      }

      console.log('✅ [CronJob] Price alert check complete.');
    } catch (err) {
      console.error('❌ [CronJob] Fatal error in price alert cron:', err.message);
    }
  });

  console.log('⏰ Price alert cron job scheduled (every hour)');
};

module.exports = { startPriceAlertCron };
