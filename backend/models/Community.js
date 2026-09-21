const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
  buildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Build',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  title: String,
  content: {
    type: String,
    required: true,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  unhelpfulCount: {
    type: Number,
    default: 0,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Comment Schema
const commentSchema = new mongoose.Schema({
  parentId: mongoose.Schema.Types.ObjectId, // Can be review or post
  parentType: {
    type: String,
    enum: ['Review', 'ForumPost'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Forum Post Schema
const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['General', 'Help', 'Showcase', 'Troubleshooting', 'Components', 'Software'],
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [String],
  views: {
    type: Number,
    default: 0,
  },
  replies: [commentSchema],
  pinned: {
    type: Boolean,
    default: false,
  },
  solved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

forumPostSchema.index({ category: 1, createdAt: -1 });

// Models
const Review = mongoose.model('Review', reviewSchema);
const Comment = mongoose.model('Comment', commentSchema);
const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = { Review, Comment, ForumPost };
