const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  store: { type: String, required: true },
  prices: [{
    price: Number,
    originalPrice: Number,
    discount: Number,
    recordedAt: { type: Date, default: Date.now },
  }],
  currentPrice: Number,
  lowestPrice: Number,
  highestPrice: Number,
  averagePrice: Number,
}, { timestamps: true });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
