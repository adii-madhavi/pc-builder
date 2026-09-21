const express = require('express');
const Build = require('../models/Build');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// RGB Presets
const rgbPresets = [
  {
    id: 'rainbow',
    name: 'Rainbow',
    colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#003366', '#0066CC', '#00CCFF', '#00FFFF'],
  },
  {
    id: 'fire',
    name: 'Fire',
    colors: ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00'],
  },
  {
    id: 'purple',
    name: 'Purple Dream',
    colors: ['#9D00FF', '#6B5FFF', '#4F46E5'],
  },
  {
    id: 'green',
    name: 'Matrix',
    colors: ['#00FF00', '#00CC00', '#009900', '#006600'],
  },
  {
    id: 'pink',
    name: 'Sakura',
    colors: ['#FFB6C1', '#FF69B4', '#FF1493', '#C71585'],
  },
];

// Get RGB presets
router.get('/presets', (req, res) => {
  try {
    res.json(rgbPresets);
  } catch (error) {
    console.error('[v0] Get RGB presets error:', error);
    res.status(500).json({ error: 'Failed to fetch presets' });
  }
});

// Update build RGB config
router.put('/config/:buildId', authMiddleware, async (req, res) => {
  try {
    const { cpuCooler, gpu, ram, case: caseRgb, fans, presetName } = req.body;
    
    const build = await Build.findByIdAndUpdate(
      req.params.buildId,
      {
        $set: {
          rgbConfig: {
            cpuCooler,
            gpu,
            ram,
            case: caseRgb,
            fans,
            presetName,
          },
        },
      },
      { new: true }
    );
    
    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }
    
    res.json(build);
  } catch (error) {
    console.error('[v0] Update RGB config error:', error);
    res.status(500).json({ error: 'Failed to update RGB config' });
  }
});

// Get build RGB config
router.get('/config/:buildId', async (req, res) => {
  try {
    const build = await Build.findById(req.params.buildId);
    
    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }
    
    res.json(build.rgbConfig);
  } catch (error) {
    console.error('[v0] Get RGB config error:', error);
    res.status(500).json({ error: 'Failed to fetch RGB config' });
  }
});

module.exports = router;
