

const Citation = require('../models/Citation');
const Article = require('../models/Article');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all citations for a specific article
 * @route   GET /api/articles/:articleId/citations
 * @access  Public
 */
const getCitationsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      year,
      citationType,
      isVerified
    } = req.query;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Build filter object
    const filters = { articleId };
    
    if (year) filters.year = parseInt(year);
    if (citationType) filters.citationType = citationType;
    if (isVerified !== undefined) filters.isVerified = isVerified === 'true';

    // Build sort object
    const sort = {};
    const order = sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = order;

    // Calculate pagination
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query
    const [citations, totalCount] = await Promise.all([
      Citation.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Citation.countDocuments(filters)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
      success: true,
      count: citations.length,
      pagination: {
        current: pageNumber,
        total: totalPages,
        limit: limitNumber,
        totalItems: totalCount,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1
      },
      data: citations
    });

  } catch (error) {
    console.error('Error fetching citations:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching citations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single citation by ID
 * @route   GET /api/citations/:id
 * @access  Public
 */
const getCitation = async (req, res) => {
  try {
    const { id } = req.params;

    const citation = await Citation.findById(id).populate('article', 'title authors');

    if (!citation) {
      return res.status(404).json({
        success: false,
        message: 'Citation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: citation
    });

  } catch (error) {
    console.error('Error fetching citation:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid citation ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching citation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create new citation for an article
 * @route   POST /api/articles/:articleId/citations
 * @access  Public
 */
const createCitation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { articleId } = req.params;
    const {
      title,
      authors,
      year,
      journal,
      volume,
      issue,
      pages,
      doi,
      url,
      citationType,
      context,
      notes
    } = req.body;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check for duplicate citation (same title and year for the same article)
    const existingCitation = await Citation.findOne({
      articleId,
      title: title.trim(),
      year: parseInt(year)
    });

    if (existingCitation) {
      return res.status(409).json({
        success: false,
        message: 'Citation with this title and year already exists for this article'
      });
    }

    // Create new citation
    const citation = new Citation({
      articleId,
      title: title.trim(),
      authors: authors.trim(),
      year: parseInt(year),
      journal: journal?.trim(),
      volume: volume?.trim(),
      issue: issue?.trim(),
      pages: pages?.trim(),
      doi: doi?.trim(),
      url: url?.trim(),
      citationType: citationType || 'direct',
      context: context?.trim(),
      notes: notes?.trim()
    });

    const savedCitation = await citation.save();

    res.status(201).json({
      success: true,
      message: 'Citation created successfully',
      data: savedCitation
    });

  } catch (error) {
    console.error('Error creating citation:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating citation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update citation
 * @route   PUT /api/citations/:id
 * @access  Public
 */
const updateCitation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Find citation first
    const existingCitation = await Citation.findById(id);
    if (!existingCitation) {
      return res.status(404).json({
        success: false,
        message: 'Citation not found'
      });
    }

    // Check for duplicate if title or year is being changed
    if ((updateData.title && updateData.title !== existingCitation.title) ||
        (updateData.year && updateData.year !== existingCitation.year)) {
      
      const duplicateCitation = await Citation.findOne({
        articleId: existingCitation.articleId,
        title: updateData.title || existingCitation.title,
        year: updateData.year || existingCitation.year,
        _id: { $ne: id }
      });

      if (duplicateCitation) {
        return res.status(409).json({
          success: false,
          message: 'Citation with this title and year already exists for this article'
        });
      }
    }

    // Trim string fields
    const trimmedData = {};
    Object.keys(updateData).forEach(key => {
      if (typeof updateData[key] === 'string') {
        trimmedData[key] = updateData[key].trim();
      } else {
        trimmedData[key] = updateData[key];
      }
    });

    // Update citation
    const updatedCitation = await Citation.findByIdAndUpdate(
      id,
      trimmedData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Citation updated successfully',
      data: updatedCitation
    });

  } catch (error) {
    console.error('Error updating citation:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid citation ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating citation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete citation
 * @route   DELETE /api/citations/:id
 * @access  Public
 */
const deleteCitation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete citation
    const citation = await Citation.findByIdAndDelete(id);

    if (!citation) {
      return res.status(404).json({
        success: false,
        message: 'Citation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Citation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting citation:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid citation ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting citation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Verify citation
 * @route   PATCH /api/citations/:id/verify
 * @access  Public
 */
const verifyCitation = async (req, res) => {
  try {
    const { id } = req.params;

    const citation = await Citation.findById(id);

    if (!citation) {
      return res.status(404).json({
        success: false,
        message: 'Citation not found'
      });
    }

    // Toggle verification status
    citation.isVerified = !citation.isVerified;
    const updatedCitation = await citation.save();

    res.status(200).json({
      success: true,
      message: `Citation ${updatedCitation.isVerified ? 'verified' : 'unverified'} successfully`,
      data: updatedCitation
    });

  } catch (error) {
    console.error('Error verifying citation:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid citation ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error verifying citation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get citation statistics for an article
 * @route   GET /api/articles/:articleId/citations/stats
 * @access  Public
 */
const getCitationStats = async (req, res) => {
  try {
    const { articleId } = req.params;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Get citation statistics
    const stats = await Citation.getStatisticsForArticle(articleId);

    // Get citations by year for chart data
    const citationsByYear = await Citation.aggregate([
      { $match: { articleId: require('mongoose').Types.ObjectId(articleId) } },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          year: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get citations by type
    const citationsByType = await Citation.aggregate([
      { $match: { articleId: require('mongoose').Types.ObjectId(articleId) } },
      {
        $group: {
          _id: '$citationType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const enhancedStats = {
      ...stats,
      yearDistribution: citationsByYear,
      typeDistribution: citationsByType
    };

    res.status(200).json({
      success: true,
      data: enhancedStats
    });

  } catch (error) {
    console.error('Error fetching citation statistics:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching citation statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Bulk import citations for an article
 * @route   POST /api/articles/:articleId/citations/bulk
 * @access  Public
 */
const bulkImportCitations = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { citations } = req.body;

    // Validate input
    if (!Array.isArray(citations) || citations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Citations array is required and cannot be empty'
      });
    }

    if (citations.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Cannot import more than 100 citations at once'
      });
    }

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Validate each citation
    const validationErrors = [];
    citations.forEach((citation, index) => {
      if (!citation.title || citation.title.trim().length === 0) {
        validationErrors.push(`Citation ${index + 1}: Title is required`);
      }
      if (!citation.authors || citation.authors.trim().length === 0) {
        validationErrors.push(`Citation ${index + 1}: Authors are required`);
      }
      if (!citation.year || isNaN(parseInt(citation.year))) {
        validationErrors.push(`Citation ${index + 1}: Valid year is required`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Perform bulk import
    const results = await Citation.bulkImport(citations, articleId);

    res.status(201).json({
      success: true,
      message: 'Bulk import completed',
      data: {
        successful: results.successful.length,
        failed: results.failed.length,
        duplicates: results.duplicates.length,
        details: results
      }
    });

  } catch (error) {
    console.error('Error bulk importing citations:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error bulk importing citations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Search citations across all articles
 * @route   GET /api/citations/search
 * @access  Public
 */
const searchCitations = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const limitNumber = Math.min(50, Math.max(1, parseInt(limit)));

    // Search in title and authors
    const citations = await Citation.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { authors: { $regex: q, $options: 'i' } }
      ]
    })
    .populate('article', 'title authors')
    .sort({ createdAt: -1 })
    .limit(limitNumber)
    .lean();

    res.status(200).json({
      success: true,
      count: citations.length,
      query: q,
      data: citations
    });

  } catch (error) {
    console.error('Error searching citations:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching citations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get formatted citation string
 * @route   GET /api/citations/:id/formatted
 * @access  Public
 */
const getFormattedCitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { style = 'apa' } = req.query;

    const citation = await Citation.findById(id);

    if (!citation) {
      return res.status(404).json({
        success: false,
        message: 'Citation not found'
      });
    }

    let formattedCitation;

    switch (style.toLowerCase()) {
      case 'apa':
        formattedCitation = citation.getFormattedCitation();
        break;
      case 'mla':
        // MLA format implementation
        formattedCitation = `${citation.authors}. "${citation.title}." ${citation.journal || 'Journal'}, ${citation.year}.`;
        break;
      case 'chicago':
        // Chicago format implementation
        formattedCitation = `${citation.authors}. "${citation.title}." ${citation.journal || 'Journal'} (${citation.year}).`;
        break;
      default:
        formattedCitation = citation.getFormattedCitation();
    }

    res.status(200).json({
      success: true,
      data: {
        id: citation._id,
        style: style.toUpperCase(),
        formatted: formattedCitation,
        raw: citation
      }
    });

  } catch (error) {
    console.error('Error formatting citation:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid citation ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error formatting citation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCitationsByArticle,
  getCitation,
  createCitation,
  updateCitation,
  deleteCitation,
  verifyCitation,
  getCitationStats,
  bulkImportCitations,
  searchCitations,
  getFormattedCitation
};