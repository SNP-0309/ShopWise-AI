const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My Wishlist' },
  products: [{
    productId: String,
    name: String,
    image: String,
    store: String,
    price: Number,
    url: String,
    addedAt: { type: Date, default: Date.now },
    aiTip: String,
  }],
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
