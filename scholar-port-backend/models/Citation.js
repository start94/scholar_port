// models/Citation.js

const mongoose = require('mongoose');

const citationSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'Article reference is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Citation title is required'],
    trim: true
  },
  authors: {
    type: String,
    required: [true, 'Citation authors are required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Publication year is required']
  },
  
  journal: { type: String, trim: true },
  volume: { type: String, trim: true },
  issue: { type: String, trim: true },
  pages: { type: String, trim: true },
  doi: { type: String, trim: true },
  url: { type: String, trim: true },
  citationType: { type: String, default: 'direct' },
  context: { type: String, trim: true },
  notes: { type: String, trim: true }
}, {
  timestamps: true,
  
  toJSON: {
    transform: (document, returnedObject) => {
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

const Citation = mongoose.model('Citation', citationSchema);

module.exports = Citation;