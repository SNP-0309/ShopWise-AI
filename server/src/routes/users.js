const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateAddWishlist, validateCreateAlert } = require('../middleware/validate');

router.use(protect);

router.get('/profile', userController.getProfile);
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist', validateAddWishlist, userController.addToWishlist);
router.delete('/wishlist/:productId', userController.removeFromWishlist);
router.get('/alerts', userController.getAlerts);
router.post('/alerts', validateCreateAlert, userController.createAlert);
router.delete('/alerts/:id', userController.deleteAlert);
router.get('/search-history', userController.getSearchHistory);
router.get('/notifications', userController.getNotifications);

module.exports = router;
