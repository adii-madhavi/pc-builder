const mongoose = require('mongoose');

const benchmarkSchema = new mongoose.Schema({
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
  cpuBenchmark: {
    score: Number,
    singleCore: Number,
    multiCore: Number,
  },
  gpuBenchmark: {
    score: Number,
    rasterization: Number,
    rayTracing: Number,
  },
  ramBenchmark: {
    score: Number,
    bandwidth: Number,
    latency: Number,
  },
  storageBenchmark: {
    readSpeed: Number,
    writeSpeed: Number,
    iops: Number,
  },
  gamingBenchmarks: {
    minecraft: {
      fps: Number,
      settings: String,
    },
    fortnite: {
      fps: Number,
      settings: String,
    },
    cyberpunk2077: {
      fps: Number,
      settings: String,
    },
    eldenRing: {
      fps: Number,
      settings: String,
    },
    starfield: {
      fps: Number,
      settings: String,
    },
  },
  thermalData: {
    cpuTemp: Number,
    gpuTemp: Number,
    ambientTemp: Number,
    timestamp: Date,
  },
  systemOverallScore: Number,
  rank: Number,
  category: {
    type: String,
    enum: ['Budget', 'Mid-Range', 'High-End', 'Enthusiast'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, { timestamps: true });

benchmarkSchema.index({ buildId: 1, createdAt: -1 });
benchmarkSchema.index({ systemOverallScore: -1, category: 1 });

module.exports = mongoose.model('Benchmark', benchmarkSchema);
