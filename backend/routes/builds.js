const express = require('express');
const Build = require('../models/Build');
const authMiddleware = require('../middleware/auth');
const performanceService = require('../services/performance');
const compatibilityService = require('../services/compatibility');

const router = express.Router();

// Get user's builds
router.get('/', authMiddleware, async (req, res) => {
  try {
    const builds = await Build.find({ userId: req.userId })
      .populate('components.cpu')
      .populate('components.gpu')
      .populate('components.motherboard')
      .populate('components.ram')
      .populate('components.psu')
      .populate('components.storage')
      .populate('components.cooler')
      .populate('components.case')
      .sort('-createdAt');
    
    res.json(builds);
  } catch (error) {
    console.error('[v0] Get builds error:', error);
    res.status(500).json({ error: 'Failed to fetch builds' });
  }
});

// Get public builds
router.get('/public/trending', async (req, res) => {
  try {
    const builds = await Build.find({ isPublic: true })
      .populate('userId', 'username profile.avatar')
      .sort('-likes -createdAt')
      .limit(20);
    
    res.json(builds);
  } catch (error) {
    console.error('[v0] Get public builds error:', error);
    res.status(500).json({ error: 'Failed to fetch builds' });
  }
});

// Get single build
router.get('/:id', async (req, res) => {
  try {
    const build = await Build.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('userId', 'username profile')
      .populate('components.cpu')
      .populate('components.gpu')
      .populate('components.motherboard')
      .populate('components.ram')
      .populate('components.psu')
      .populate('components.storage')
      .populate('components.cooler')
      .populate('components.case');
    
    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }
    
    res.json(build);
  } catch (error) {
    console.error('[v0] Get build error:', error);
    res.status(500).json({ error: 'Failed to fetch build' });
  }
});

// Create build
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, components } = req.body;
    
    const build = new Build({
      userId: req.userId,
      name,
      description,
      components,
    });
    
    // Calculate total cost
    await build.populate('components.cpu components.gpu components.motherboard components.ram components.psu components.storage components.cooler components.case');
    
    let totalCost = 0;
    Object.values(build.components).forEach(component => {
      if (Array.isArray(component)) {
        component.forEach(c => totalCost += c?.price || 0);
      } else {
        totalCost += component?.price || 0;
      }
    });
    
    build.totalCost = totalCost;
    
    // Check compatibility
    const compatibility = await compatibilityService.checkCompatibility(build.components);
    build.compatibility = compatibility;
    
    // Calculate performance
    const performance = await performanceService.calculatePerformance(build.components);
    build.performance = performance;
    
    // Calculate thermal
    const thermal = await performanceService.calculateThermal(build.components);
    build.thermal = thermal;
    
    // Calculate power
    const power = await performanceService.calculatePower(build.components);
    build.power = power;
    
    await build.save();
    
    res.status(201).json(build);
  } catch (error) {
    console.error('[v0] Create build error:', error);
    res.status(500).json({ error: 'Failed to create build' });
  }
});

// Update build
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);
    
    if (!build || build.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    Object.assign(build, req.body);
    
    // Recalculate metrics
    await build.populate('components.cpu components.gpu components.motherboard components.ram components.psu components.storage components.cooler components.case');
    
    let totalCost = 0;
    Object.values(build.components).forEach(component => {
      if (Array.isArray(component)) {
        component.forEach(c => totalCost += c?.price || 0);
      } else {
        totalCost += component?.price || 0;
      }
    });
    
    build.totalCost = totalCost;
    build.compatibility = await compatibilityService.checkCompatibility(build.components);
    build.performance = await performanceService.calculatePerformance(build.components);
    build.thermal = await performanceService.calculateThermal(build.components);
    build.power = await performanceService.calculatePower(build.components);
    
    await build.save();
    
    res.json(build);
  } catch (error) {
    console.error('[v0] Update build error:', error);
    res.status(500).json({ error: 'Failed to update build' });
  }
});

// Delete build
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);
    
    if (!build || build.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await Build.deleteOne({ _id: req.params.id });
    res.json({ message: 'Build deleted' });
  } catch (error) {
    console.error('[v0] Delete build error:', error);
    res.status(500).json({ error: 'Failed to delete build' });
  }
});

// Clone build
router.post('/:id/clone', authMiddleware, async (req, res) => {
  try {
    const original = await Build.findById(req.params.id);
    
    if (!original) {
      return res.status(404).json({ error: 'Build not found' });
    }
    
    const cloned = new Build({
      userId: req.userId,
      name: `${original.name} (Clone)`,
      description: original.description,
      components: original.components,
      totalCost: original.totalCost,
      performance: original.performance,
      thermal: original.thermal,
      power: original.power,
      compatibility: original.compatibility,
    });
    
    await cloned.save();
    res.status(201).json(cloned);
  } catch (error) {
    console.error('[v0] Clone build error:', error);
    res.status(500).json({ error: 'Failed to clone build' });
  }
});

// Like build
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const build = await Build.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(build);
  } catch (error) {
    console.error('[v0] Like build error:', error);
    res.status(500).json({ error: 'Failed to like build' });
  }
});

module.exports = router;
