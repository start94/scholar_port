

const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleStats,
  searchArticles
} = require('../controllers/articleController');

const {
  getCitationsByArticle,
  createCitation,
  getCitationStats,
  bulkImportCitations
} = require('../controllers/citationController');

const router = express.Router();

// Validation middleware for article creation and updates
const articleValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Title must be between 3 and 500 characters')
    .trim(),
  
  body('authors')
    .isArray({ min: 1 })
    .withMessage('At least one author is required')
    .custom((authors) => {
      if (!authors.every(author => typeof author === 'string' && author.trim().length >= 2)) {
        throw new Error('Each author must be a string with at least 2 characters');
      }
      return true;
    }),
  
  body('abstract')
    .notEmpty()
    .withMessage('Abstract is required')
    .isLength({ min: 50, max: 5000 })
    .withMessage('Abstract must be between 50 and 5000 characters')
    .trim(),
  
  body('publicationDate')
    .isISO8601()
    .withMessage('Publication date must be a valid date')
    .custom((date) => {
      if (new Date(date) > new Date()) {
        throw new Error('Publication date cannot be in the future');
      }
      return true;
    }),
  
  body('doi')
    .notEmpty()
    .withMessage('DOI is required')
    .matches(/^10\.\d{4,}\/\S+/)
    .withMessage('DOI must be in valid format (e.g., 10.1000/182)')
    .trim(),
  
  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array'),
  
  body('keywords.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each keyword cannot exceed 50 characters')
    .trim(),
  
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
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'in-review', 'accepted'])
    .withMessage('Status must be one of: draft, published, in-review, accepted')
];

// Validation for citation creation
const citationValidation = [
  body('title')
    .notEmpty()
    .withMessage('Citation title is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Citation title must be between 3 and 500 characters')
    .trim(),
  
  body('authors')
    .notEmpty()
    .withMessage('Citation authors are required')
    .isLength({ min: 2, max: 300 })
    .withMessage('Authors must be between 2 and 300 characters')
    .trim(),
  
  body('year')
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
    .trim()
];

// Parameter validation
const validateObjectId = param('id')
  .isMongoId()
  .withMessage('Invalid ID format');

const validateArticleId = param('articleId')
  .isMongoId()
  .withMessage('Invalid article ID format');

// Query parameter validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('sortBy')
    .optional()
    .isIn(['title', 'publicationDate', 'createdAt', 'citations'])
    .withMessage('SortBy must be one of: title, publicationDate, createdAt, citations'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder must be either asc or desc')
];

// ===== ARTICLE ROUTES =====

/**
 * @route   GET /api/articles
 * @desc    Get all articles with filtering and pagination
 * @access  Public
 */
router.get('/', paginationValidation, getArticles);

/**
 * @route   GET /api/articles/search
 * @desc    Search articles with text search
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
], searchArticles);

/**
 * @route   POST /api/articles
 * @desc    Create new article
 * @access  Public
 */
router.post('/', articleValidation, createArticle);

/**
 * @route   GET /api/articles/:id
 * @desc    Get single article by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, getArticle);

/**
 * @route   PUT /api/articles/:id
 * @desc    Update article
 * @access  Public
 */
router.put('/:id', [validateObjectId, ...articleValidation], updateArticle);

/**
 * @route   DELETE /api/articles/:id
 * @desc    Delete article and all its citations
 * @access  Public
 */
router.delete('/:id', validateObjectId, deleteArticle);

/**
 * @route   GET /api/articles/:id/stats
 * @desc    Get article statistics
 * @access  Public
 */
router.get('/:id/stats', validateObjectId, getArticleStats);

// ===== CITATION ROUTES (nested under articles) =====

/**
 * @route   GET /api/articles/:articleId/citations
 * @desc    Get all citations for a specific article
 * @access  Public
 */
router.get('/:articleId/citations', [
  validateArticleId,
  ...paginationValidation,
  query('year')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be a valid integer'),
  query('citationType')
    .optional()
    .isIn(['direct', 'indirect', 'supporting', 'contrasting', 'methodological'])
    .withMessage('Citation type must be valid'),
  query('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be a boolean')
], getCitationsByArticle);

/**
 * @route   POST /api/articles/:articleId/citations
 * @desc    Create new citation for an article
 * @access  Public
 */
router.post('/:articleId/citations', [
  validateArticleId,
  ...citationValidation
], createCitation);

/**
 * @route   GET /api/articles/:articleId/citations/stats
 * @desc    Get citation statistics for an article
 * @access  Public
 */
router.get('/:articleId/citations/stats', validateArticleId, getCitationStats);

/**
 * @route   POST /api/articles/:articleId/citations/bulk
 * @desc    Bulk import citations for an article
 * @access  Public
 */
router.post('/:articleId/citations/bulk', [
  validateArticleId,
  body('citations')
    .isArray({ min: 1, max: 100 })
    .withMessage('Citations must be an array with 1-100 items'),
  body('citations.*.title')
    .notEmpty()
    .withMessage('Each citation must have a title'),
  body('citations.*.authors')
    .notEmpty()
    .withMessage('Each citation must have authors'),
  body('citations.*.year')
    .isInt({ min: 1800, max: new Date().getFullYear() + 1 })
    .withMessage('Each citation must have a valid year')
], bulkImportCitations);

// Error handling middleware for routes
router.use((error, req, res, next) => {
  console.error('Route error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error in article routes',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;