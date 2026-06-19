const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: String,
  store: String,
  currentPrice: Number,
  targetPrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  triggered: { type: Boolean, default: false },
  triggeredAt: Date,
  triggeredPrice: Number,
  notificationSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
