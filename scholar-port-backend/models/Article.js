
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [500, 'Title cannot exceed 500 characters'],
    index: true
  },
  authors: [{
    type: String,
    required: [true, 'At least one author is required'],
    trim: true,
    minlength: [2, 'Author name must be at least 2 characters long'],
    maxlength: [100, 'Author name cannot exceed 100 characters']
  }],
  abstract: {
    type: String,
    required: [true, 'Abstract is required'],
    trim: true,
    minlength: [50, 'Abstract must be at least 50 characters long'],
    maxlength: [5000, 'Abstract cannot exceed 5000 characters']
  },
  publicationDate: {
    type: Date,
    required: [true, 'Publication date is required']
  },
  doi: {
    type: String,
    required: [true, 'DOI is required'],
    unique: true,
    trim: true,
    validate: {
      validator: (doi) => /^10\.\d{4,}\/\S+/.test(doi),
      message: 'Please provide a valid DOI format (e.g., 10.1000/182)'
    },
    index: true
  },
  keywords: [{
    type: String,
    trim: true,
    maxlength: [50, 'Keyword cannot exceed 50 characters']
  }],
  journal: {
    type: String,
    trim: true,
    maxlength: [200, 'Journal name cannot exceed 200 characters']
  },
  volume: {
    type: String,
    trim: true,
    maxlength: [20, 'Volume cannot exceed 20 characters']
  },
  issue: {
    type: String,
    trim: true,
    maxlength: [20, 'Issue cannot exceed 20 characters']
  },
  pages: {
    type: String,
    trim: true,
    maxlength: [50, 'Pages cannot exceed 50 characters']
  },
  citationCount: {
    type: Number,
    default: 0,
    min: [0, 'Citation count cannot be negative']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'in-review', 'accepted'],
    default: 'published'
  }
}, {
  timestamps: true,
  
  toJSON: {
    transform: (document, returnedObject) => {
      // Clona l'_id in una nuova proprietà 'id' come stringa
      returnedObject.id = returnedObject._id.toString();
      
      
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  },
  toObject: {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  }
});

// Virtual per ottenere le citazioni associate
articleSchema.virtual('citations', {
  ref: 'Citation',
  localField: '_id',
  foreignField: 'articleId'
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;