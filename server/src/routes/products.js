const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { optionalAuth } = require('../middleware/auth');
const { validateSearch } = require('../middleware/validate');

router.get('/search', optionalAuth, validateSearch, productController.search);
router.get('/trending', productController.getTrending);
router.get('/featured', productController.getFeatured);
router.get('/suggestions', productController.getSuggestions);
router.get('/:id', optionalAuth, productController.getProduct);

module.exports = router;
