const Wishlist = require('../models/Wishlist');
const Alert = require('../models/Alert');
const SearchHistory = require('../models/SearchHistory');
const Notification = require('../models/Notification');

exports.getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id });
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId, name, image, store, price, url } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id, isDefault: true });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, isDefault: true, name: 'My Wishlist', products: [] });
    }
    const exists = wishlist.products.find((p) => p.productId === productId);
    if (exists) return res.status(400).json({ success: false, message: 'Already in wishlist' });
    wishlist.products.push({ productId, name, image, store, price, url });
    await wishlist.save();
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user.id, isDefault: true });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    wishlist.products = wishlist.products.filter((p) => p.productId !== productId);
    await wishlist.save();
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id, isActive: true });
    res.json({ success: true, alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { productId, productName, productImage, store, currentPrice, targetPrice } = req.body;
    const alert = await Alert.create({ user: req.user.id, productId, productName, productImage, store, currentPrice, targetPrice });
    res.status(201).json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    await Alert.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true, message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const history = await SearchHistory.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
