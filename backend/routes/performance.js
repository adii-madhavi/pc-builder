const express = require('express');
const Benchmark = require('../models/Benchmark');
const Build = require('../models/Build');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get benchmarks leaderboard
router.get('/benchmarks', async (req, res) => {
  try {
    const { category = 'High-End', skip = 0, limit = 50 } = req.query;
    
    const benchmarks = await Benchmark.find({ category })
      .populate('buildId', 'name components')
      .populate('userId', 'username profile.avatar')
      .sort('-systemOverallScore')
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    const total = await Benchmark.countDocuments({ category });
    
    res.json({ benchmarks, total });
  } catch (error) {
    console.error('[v0] Get benchmarks error:', error);
    res.status(500).json({ error: 'Failed to fetch benchmarks' });
  }
});

// Get specific build benchmarks
router.get('/benchmarks/:buildId', async (req, res) => {
  try {
    const benchmarks = await Benchmark.find({ buildId: req.params.buildId })
      .sort('-createdAt');
    
    res.json(benchmarks);
  } catch (error) {
    console.error('[v0] Get build benchmarks error:', error);
    res.status(500).json({ error: 'Failed to fetch benchmarks' });
  }
});

// Create benchmark result
router.post('/benchmarks', authMiddleware, async (req, res) => {
  try {
    const {
      buildId,
      cpuBenchmark,
      gpuBenchmark,
      ramBenchmark,
      storageBenchmark,
      gamingBenchmarks,
      thermalData,
    } = req.body;
    
    // Calculate overall score
    const overallScore = Math.round(
      (cpuBenchmark?.score || 0) * 0.25 +
      (gpuBenchmark?.score || 0) * 0.5 +
      (ramBenchmark?.score || 0) * 0.15 +
      (storageBenchmark?.iops || 0) * 0.1
    );
    
    // Determine category
    let category = 'Mid-Range';
    if (overallScore > 15000) category = 'Enthusiast';
    else if (overallScore > 10000) category = 'High-End';
    else if (overallScore < 5000) category = 'Budget';
    
    const benchmark = new Benchmark({
      buildId,
      userId: req.userId,
      cpuBenchmark,
      gpuBenchmark,
      ramBenchmark,
      storageBenchmark,
      gamingBenchmarks,
      thermalData,
      systemOverallScore: overallScore,
      category,
    });
    
    await benchmark.save();
    await benchmark.populate('buildId userId');
    
    // Update build with benchmark data
    await Build.findByIdAndUpdate(
      buildId,
      { $set: { 'performance.gamingFps': gamingBenchmarks } }
    );
    
    res.status(201).json(benchmark);
  } catch (error) {
    console.error('[v0] Create benchmark error:', error);
    res.status(500).json({ error: 'Failed to create benchmark' });
  }
});

module.exports = router;
