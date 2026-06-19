const { body, query, param, validationResult } = require('express-validator');

/**
 * Middleware: returns 422 if express-validator found errors.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Auth validators ────────────────────────────────────────────────
const validateUpdateProfile = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name must be 1–100 characters'),
  validate,
];

// ── Product validators ─────────────────────────────────────────────
const validateSearch = [
  query('q')
    .notEmpty().withMessage('Search query is required')
    .isString()
    .trim()
    .isLength({ min: 1, max: 300 }).withMessage('Query must be 1–300 characters'),
  query('maxBudget')
    .optional()
    .isNumeric().withMessage('maxBudget must be a number'),
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be 0–5'),
  validate,
];

// ── AI validators ──────────────────────────────────────────────────
const validateChat = [
  body('messages')
    .isArray({ min: 1 }).withMessage('messages must be a non-empty array'),
  body('messages.*.role')
    .isIn(['user', 'assistant', 'system']).withMessage('Invalid message role'),
  body('messages.*.content')
    .isString().withMessage('Message content must be a string')
    .isLength({ max: 2000 }).withMessage('Message too long (max 2000 chars)'),
  validate,
];

const validateCompare = [
  body('products')
    .isArray({ min: 2, max: 5 }).withMessage('Provide 2–5 products for comparison'),
  validate,
];

const validateShoppingAgent = [
  body('query')
    .notEmpty().withMessage('Query is required')
    .isString()
    .isLength({ max: 500 }).withMessage('Query too long (max 500 chars)'),
  body('budget')
    .notEmpty().withMessage('Budget is required'),
  validate,
];

// ── User validators ────────────────────────────────────────────────
const validateAddWishlist = [
  body('productId').notEmpty().withMessage('productId is required'),
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('price must be a number'),
  validate,
];

const validateCreateAlert = [
  body('productId').notEmpty().withMessage('productId is required'),
  body('productName').notEmpty().withMessage('productName is required'),
  body('targetPrice')
    .isNumeric().withMessage('targetPrice must be a number')
    .isFloat({ min: 1 }).withMessage('targetPrice must be > 0'),
  body('currentPrice')
    .isNumeric().withMessage('currentPrice must be a number'),
  validate,
];

module.exports = {
  validate,
  validateUpdateProfile,
  validateSearch,
  validateChat,
  validateCompare,
  validateShoppingAgent,
  validateAddWishlist,
  validateCreateAlert,
};
