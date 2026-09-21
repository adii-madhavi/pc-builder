const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['CPU', 'GPU', 'Motherboard', 'RAM', 'PSU', 'Storage', 'Cooler', 'Case'],
    required: true,
    index: true,
  },
  brand: {
    type: String,
    required: true,
    index: true,
  },
  model: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    index: true,
  },
  specs: mongoose.Schema.Types.Mixed,
  performance_tier: {
    type: String,
    enum: ['Budget', 'Mid-Range', 'High-End', 'Enthusiast'],
    default: 'Mid-Range',
  },
  image: String,
  releaseDate: Date,
  
  // CPU specific
  cpu: {
    cores: Number,
    threads: Number,
    clockSpeed: Number,
    boostSpeed: Number,
    tdp: Number,
    socket: String,
    architecture: String,
    cache: String,
  },
  
  // GPU specific
  gpu: {
    vram: Number,
    memoryType: String,
    memoryBandwidth: Number,
    cudaCores: Number,
    tdp: Number,
    powerConnectors: [String],
    displayOutputs: [String],
    boostClock: Number,
  },
  
  // Motherboard specific
  motherboard: {
    socket: String,
    formFactor: {
      type: String,
      enum: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'],
    },
    vrmPhases: Number,
    pciSlots: Number,
    ramSlots: Number,
    ramType: String,
    bios: String,
  },
  
  // RAM specific
  ram: {
    capacity: Number,
    speed: Number,
    type: {
      type: String,
      enum: ['DDR4', 'DDR5'],
    },
    voltage: Number,
  },
  
  // PSU specific
  psu: {
    wattage: Number,
    efficiency: String,
    modular: Boolean,
    certifications: [String],
    connectors: mongoose.Schema.Types.Mixed,
  },
  
  // Storage specific
  storage: {
    type: String,
    enum: ['SSD', 'HDD', 'NVMe'],
    capacity: Number,
    interface: String,
    speed: Number,
  },
  
  // Cooler specific
  cooler: {
    type: String,
    enum: ['Air', 'Liquid', 'Hybrid'],
    tdpCapability: Number,
    socketCompatibility: [String],
    maxHeight: Number,
  },
  
  // Case specific
  case: {
    formFactor: String,
    maxGpuLength: Number,
    maxCoolerHeight: Number,
    driveBays: mongoose.Schema.Types.Mixed,
  },
  
  available: {
    type: Boolean,
    default: true,
    index: true,
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

// Compound index for efficient filtering
componentSchema.index({ type: 1, brand: 1, price: 1 });
componentSchema.index({ type: 1, performance_tier: 1 });

module.exports = mongoose.model('Component', componentSchema);
