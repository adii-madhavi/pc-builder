const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  components: {
    cpu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
    },
    gpu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
    },
    motherboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
    },
    ram: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
    }],
    psu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
    },
    storage: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
    }],
    cooler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
    },
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
    },
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  performance: {
    cpuScore: Number,
    gpuScore: Number,
    overallScore: Number,
    bottleneck: {
      percentage: Number,
      component: String,
    },
    gamingFps: {
      minecraft: Number,
      fortnite: Number,
      cyberpunk: Number,
      elden_ring: Number,
    },
  },
  thermal: {
    cpuTDP: Number,
    gpuTDP: Number,
    totalTDP: Number,
    caseAirflow: String,
    thermalHeadroom: Number,
    recommendations: [String],
  },
  power: {
    estimatedDraw: Number,
    psuWattage: Number,
    headroom: Number,
    adequate: Boolean,
  },
  rgbConfig: {
    cpuCooler: String,
    gpu: String,
    ram: String,
    case: String,
    fans: String,
    presetName: String,
  },
  compatibility: {
    isCompatible: Boolean,
    warnings: [String],
    errors: [String],
  },
  images: [String],
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
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

buildSchema.index({ userId: 1, createdAt: -1 });
buildSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('Build', buildSchema);
