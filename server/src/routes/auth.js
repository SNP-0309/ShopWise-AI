const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/sync', protect, authController.syncUser);
router.post('/sync', protect, authController.syncUser);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
