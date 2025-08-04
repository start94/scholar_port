// controllers/articleController.js

const Article = require('../models/Article');
const Citation = require('../models/Citation');
const { validationResult } = require('express-validator');

const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'publicationDate', sortOrder = 'desc', search, year } = req.query;

    const filters = {};
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } }
      ];
    }
    if (year) {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      filters.publicationDate = { $gte: startDate, $lte: endDate };
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [articles, totalCount] = await Promise.all([
      Article.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber),
      Article.countDocuments(filters)
    ]);

    res.status(200).json({
      success: true,
      count: articles.length,
      pagination: { totalItems: totalCount },
      data: articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    const citations = await Citation.find({ articleId: req.params.id });
    
    const articleData = article.toJSON();
    articleData.citations = citations;

    res.status(200).json({ success: true, data: articleData });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    console.error('Error fetching article:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const createArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const existingArticle = await Article.findOne({ doi: req.body.doi });
    if (existingArticle) {
      return res.status(409).json({ success: false, message: 'Article with this DOI already exists' });
    }

    const article = new Article(req.body);
    const savedArticle = await article.save();
    res.status(201).json({ success: true, data: savedArticle });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await Citation.deleteMany({ articleId: req.params.id });
    await article.deleteOne();

    res.status(200).json({ success: true, message: 'Article and citations deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    console.error('Error deleting article:', error);
    res.status(500).json({ success: false, message: 'Error deleting article' });
  }
};


const getArticleStats = async (req, res) => {
  // Implementazione di base per evitare crash
  res.status(200).json({ success: true, message: 'Stats endpoint not fully implemented yet.' });
};

const searchArticles = async (req, res) => {
  // Implementazione di base per evitare crash
  res.status(200).json({ success: true, message: 'Search endpoint not fully implemented yet.' });
};


module.exports = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleStats,   
  searchArticles     
};