const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter && process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Send a price drop alert email to a user.
 * @param {string} to - recipient email
 * @param {Object} opts
 * @param {string} opts.productName
 * @param {number} opts.currentPrice
 * @param {number} opts.targetPrice
 * @param {string} opts.productImage
 * @param {string} opts.store
 */
const sendPriceAlertEmail = async (to, { productName, currentPrice, targetPrice, productImage, store }) => {
  const t = getTransporter();
  if (!t) {
    console.warn('⚠️ Email not configured — skipping price alert email');
    return;
  }

  const priceFormatted = (n) => `₹${n?.toLocaleString('en-IN')}`;

  const html = `
  <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9ff; border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #6C63FF, #A855F7); padding: 2rem; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 1.5rem;">🎉 Price Drop Alert!</h1>
      <p style="color: rgba(255,255,255,0.8); margin-top: 0.5rem;">Your target price has been reached</p>
    </div>
    <div style="padding: 2rem;">
      ${productImage ? `<img src="${productImage}" alt="" style="width: 120px; height: 120px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem; display: block;">` : ''}
      <h2 style="color: #0F0E17; margin-bottom: 0.5rem;">${productName}</h2>
      <p style="color: #6B7280; margin-bottom: 1.5rem;">Available on <strong>${store}</strong></p>
      <div style="display: flex; gap: 1rem; background: white; border-radius: 12px; padding: 1.25rem; border: 1px solid #e5e7eb;">
        <div style="flex: 1; text-align: center;">
          <p style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Target Price</p>
          <p style="color: #10B981; font-size: 1.5rem; font-weight: 800;">${priceFormatted(targetPrice)}</p>
        </div>
        <div style="flex: 1; text-align: center;">
          <p style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Current Price</p>
          <p style="color: #6C63FF; font-size: 1.5rem; font-weight: 800;">${priceFormatted(currentPrice)}</p>
        </div>
      </div>
      <div style="margin-top: 1.5rem; text-align: center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/search?q=${encodeURIComponent(productName)}"
          style="display: inline-block; background: linear-gradient(135deg, #6C63FF, #A855F7); color: white; padding: 0.875rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 700;">
          🛒 Buy Now
        </a>
      </div>
    </div>
    <div style="padding: 1rem 2rem; background: #f3f4f6; text-align: center; font-size: 0.75rem; color: #9CA3AF;">
      You're receiving this because you set a price alert on ShopWise AI.<br>
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="color: #6C63FF;">Manage your alerts →</a>
    </div>
  </div>`;

  try {
    await t.sendMail({
      from: `"ShopWise AI 🛍️" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🎉 Price Drop! ${productName} is now ${priceFormatted(currentPrice)}`,
      html,
    });
    console.log(`✅ Price alert email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
  }
};

module.exports = { sendPriceAlertEmail };
