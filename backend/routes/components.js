const express = require('express');
const Component = require('../models/Component');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all components with filtering
router.get('/', async (req, res) => {
  try {
    const { type, brand, minPrice, maxPrice, sort = '-createdAt', limit = 50, skip = 0 } = req.query;
    
    let query = { available: true };
    
    if (type) query.type = type;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const components = await Component.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Component.countDocuments(query);
    
    res.json({ components, total, limit, skip });
  } catch (error) {
    console.error('[v0] Get components error:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

// Get component by ID
router.get('/:id', async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json(component);
  } catch (error) {
    console.error('[v0] Get component error:', error);
    res.status(500).json({ error: 'Failed to fetch component' });
  }
});

// Get components by type
router.get('/type/:type', async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    
    const components = await Component.find({ type: req.params.type, available: true })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Component.countDocuments({ type: req.params.type, available: true });
    
    res.json({ components, total });
  } catch (error) {
    console.error('[v0] Get components by type error:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

// Create component (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const component = new Component(req.body);
    await component.save();
    res.status(201).json(component);
  } catch (error) {
    console.error('[v0] Create component error:', error);
    res.status(500).json({ error: 'Failed to create component' });
  }
});

// Update component (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json(component);
  } catch (error) {
    console.error('[v0] Update component error:', error);
    res.status(500).json({ error: 'Failed to update component' });
  }
});

// Delete component (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json({ message: 'Component deleted' });
  } catch (error) {
    console.error('[v0] Delete component error:', error);
    res.status(500).json({ error: 'Failed to delete component' });
  }
});

module.exports = router;
