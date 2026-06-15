const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth, protect } = require('../middleware/auth');

router.post('/chat', optionalAuth, aiController.chatWithAI);
router.post('/compare', optionalAuth, aiController.compareProducts);
router.post('/agent', optionalAuth, aiController.shoppingAgent);

module.exports = router;
