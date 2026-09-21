const express = require('express');
const { Review, Comment, ForumPost } = require('../models/Community');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Forum endpoints
router.get('/forums', async (req, res) => {
  try {
    const { category, skip = 0, limit = 20 } = req.query;
    
    let query = {};
    if (category) query.category = category;
    
    const posts = await ForumPost.find(query)
      .populate('userId', 'username profile.avatar')
      .sort('-pinned -createdAt')
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    const total = await ForumPost.countDocuments(query);
    
    res.json({ posts, total });
  } catch (error) {
    console.error('[v0] Get forum posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/forums', authMiddleware, async (req, res) => {
  try {
    const { title, category, content, tags } = req.body;
    
    const post = new ForumPost({
      userId: req.userId,
      title,
      category,
      content,
      tags: tags || [],
    });
    
    await post.save();
    await post.populate('userId', 'username profile.avatar');
    
    res.status(201).json(post);
  } catch (error) {
    console.error('[v0] Create forum post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/forums/:id', async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('userId', 'username profile.avatar')
      .populate('replies');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('[v0] Get forum post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Reviews endpoints
router.get('/reviews/:buildId', async (req, res) => {
  try {
    const reviews = await Review.find({ buildId: req.params.buildId })
      .populate('userId', 'username profile.avatar')
      .sort('-createdAt');
    
    res.json(reviews);
  } catch (error) {
    console.error('[v0] Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/reviews', authMiddleware, async (req, res) => {
  try {
    const { buildId, rating, title, content, tags } = req.body;
    
    const review = new Review({
      buildId,
      userId: req.userId,
      rating,
      title,
      content,
      tags: tags || [],
    });
    
    await review.save();
    await review.populate('userId', 'username profile.avatar');
    
    res.status(201).json(review);
  } catch (error) {
    console.error('[v0] Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

router.post('/reviews/:id/helpful', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    res.json(review);
  } catch (error) {
    console.error('[v0] Mark helpful error:', error);
    res.status(500).json({ error: 'Failed to mark helpful' });
  }
});

// Comments endpoints
router.post('/comments', authMiddleware, async (req, res) => {
  try {
    const { parentId, parentType, content } = req.body;
    
    const comment = new Comment({
      parentId,
      parentType,
      userId: req.userId,
      content,
    });
    
    await comment.save();
    await comment.populate('userId', 'username profile.avatar');
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('[v0] Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

module.exports = router;
