const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth');
const { validateChat, validateCompare, validateShoppingAgent } = require('../middleware/validate');

router.post('/chat', optionalAuth, validateChat, aiController.chatWithAI);
router.post('/compare', optionalAuth, validateCompare, aiController.compareProducts);
router.post('/agent', optionalAuth, validateShoppingAgent, aiController.shoppingAgent);

module.exports = router;
