/**
 * Citation Routes for ScholarPort
 * Defines direct citation endpoints (not nested under articles)
 */

const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getCitation,
  updateCitation,
  deleteCitation,
  verifyCitation,
  searchCitations,
  getFormattedCitation
} = require('../controllers/citationController');

const router = express.Router();

// Validation middleware for citation updates
const citationUpdateValidation = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 500 })
    .withMessage('Citation title must be between 3 and 500 characters')
    .trim(),
  
  body('authors')
    .optional()
    .isLength({ min: 2, max: 300 })
    .withMessage('Authors must be between 2 and 300 characters')
    .trim(),
  
  body('year')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be a valid integer between 1800 and next year'),
  
  body('journal')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Journal name cannot exceed 200 characters')
    .trim(),
  
  body('volume')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Volume cannot exceed 20 characters')
    .trim(),
  
  body('issue')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Issue cannot exceed 20 characters')
    .trim(),
  
  body('pages')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Pages cannot exceed 50 characters')
    .trim(),
  
  body('doi')
    .optional()
    .matches(/^10\.\d{4,}\/\S+/)
    .withMessage('DOI must be in valid format (e.g., 10.1000/182)')
    .trim(),
  
  body('url')
    .optional()
    .isURL()
    .withMessage('URL must be a valid URL')
    .trim(),
  
  body('citationType')
    .optional()
    .isIn(['direct', 'indirect', 'supporting', 'contrasting', 'methodological'])
    .withMessage('Citation type must be one of: direct, indirect, supporting, contrasting, methodological'),
  
  body('context')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Context cannot exceed 1000 characters')
    .trim(),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
    .trim(),
  
  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be a boolean')
];

// Parameter validation
const validateObjectId = param('id')
  .isMongoId()
  .withMessage('Invalid citation ID format');

/**
 * @route   GET /api/citations/search
 * @desc    Search citations across all articles
 * @access  Public
 */
router.get('/search', [
  query('q')
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], searchCitations);

/**
 * @route   GET /api/citations/:id
 * @desc    Get single citation by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, getCitation);

/**
 * @route   PUT /api/citations/:id
 * @desc    Update citation
 * @access  Public
 */
router.put('/:id', [validateObjectId, ...citationUpdateValidation], updateCitation);

/**
 * @route   DELETE /api/citations/:id
 * @desc    Delete citation
 * @access  Public
 */
router.delete('/:id', validateObjectId, deleteCitation);

/**
 * @route   PATCH /api/citations/:id/verify
 * @desc    Toggle citation verification status
 * @access  Public
 */
router.patch('/:id/verify', validateObjectId, verifyCitation);

/**
 * @route   GET /api/citations/:id/formatted
 * @desc    Get formatted citation string
 * @access  Public
 */
router.get('/:id/formatted', [
  validateObjectId,
  query('style')
    .optional()
    .isIn(['apa', 'mla', 'chicago'])
    .withMessage('Style must be one of: apa, mla, chicago')
], getFormattedCitation);

// Error handling middleware for citation routes
router.use((error, req, res, next) => {
  console.error('Citation route error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error in citation routes',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;