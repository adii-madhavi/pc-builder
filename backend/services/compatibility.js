// Compatibility checking service

const checkCompatibility = async (components) => {
  try {
    const warnings = [];
    const errors = [];
    
    // CPU Socket compatibility
    if (components.cpu && components.motherboard) {
      const cpuSocket = components.cpu.cpu?.socket;
      const moboSocket = components.motherboard.motherboard?.socket;
      
      if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
        errors.push(`CPU socket ${cpuSocket} is not compatible with motherboard socket ${moboSocket}`);
      }
    }
    
    // RAM Type compatibility
    if (components.ram && components.ram.length > 0 && components.motherboard) {
      const ramType = components.ram[0].ram?.type;
      const moboRamType = components.motherboard.motherboard?.ramType;
      
      if (ramType && moboRamType && ramType !== moboRamType) {
        errors.push(`RAM type ${ramType} is not compatible with motherboard (${moboRamType})`);
      }
    }
    
    // GPU physical fit
    if (components.gpu && components.case) {
      const gpuLength = 270; // Default length in mm
      const maxGpuLength = components.case.case?.maxGpuLength;
      
      if (maxGpuLength && gpuLength > maxGpuLength) {
        errors.push(`GPU length (${gpuLength}mm) exceeds case maximum (${maxGpuLength}mm)`);
      }
    }
    
    // CPU Cooler clearance
    if (components.cooler && components.case && components.cpu) {
      const coolerHeight = components.cooler.cooler?.maxHeight || 160;
      const maxCoolerHeight = components.case.case?.maxCoolerHeight || 160;
      
      if (coolerHeight > maxCoolerHeight) {
        errors.push(`Cooler height (${coolerHeight}mm) exceeds case clearance (${maxCoolerHeight}mm)`);
      }
      
      // Check if cooler is compatible with CPU socket
      const cpuSocket = components.cpu.cpu?.socket;
      const coolerCompatibility = components.cooler.cooler?.socketCompatibility || [];
      
      if (cpuSocket && coolerCompatibility.length > 0 && !coolerCompatibility.includes(cpuSocket)) {
        errors.push(`Cooler is not compatible with CPU socket ${cpuSocket}`);
      }
    }
    
    // PSU wattage adequacy
    if (components.psu && components.cpu && components.gpu) {
      const cpuTDP = components.cpu.cpu?.tdp || 65;
      const gpuTDP = components.gpu.gpu?.tdp || 150;
      const totalTDP = cpuTDP + gpuTDP + 50; // Add 50W for mobo/storage
      const requiredWattage = totalTDP * 1.25; // 25% headroom
      const psuWattage = components.psu.psu?.wattage || 850;
      
      if (psuWattage < requiredWattage) {
        errors.push(`PSU (${psuWattage}W) may be insufficient for this build (recommended ${Math.round(requiredWattage)}W)`);
      }
    }
    
    // Power connector checks
    if (components.gpu && components.psu) {
      const gpuConnectors = components.gpu.gpu?.powerConnectors || [];
      const psuConnectors = components.psu.psu?.connectors || {};
      
      // Check for PCIe power connectors
      if (gpuConnectors.includes('8-pin') && !psuConnectors['8-pin']) {
        warnings.push('GPU requires 8-pin PCIe connector but PSU may not have one');
      }
    }
    
    // RAM capacity warning
    if (components.ram && components.ram.length > 0) {
      const ramCapacity = components.ram.reduce((sum, ram) => sum + (ram.ram?.capacity || 8), 0);
      
      if (ramCapacity > 128) {
        warnings.push(`Very high RAM capacity (${ramCapacity}GB) - ensure this is intentional`);
      }
    }
    
    // Case form factor check
    if (components.motherboard && components.case) {
      const moboFormFactor = components.motherboard.motherboard?.formFactor;
      const caseFormFactor = components.case.case?.formFactor;
      
      // Mini-ITX can fit in Mini-ITX, Micro-ATX, ATX cases
      // Micro-ATX can fit in Micro-ATX, ATX cases
      // ATX can only fit in ATX cases
      // E-ATX cannot fit in standard ATX
      
      if (moboFormFactor === 'E-ATX' && caseFormFactor !== 'E-ATX') {
        errors.push(`E-ATX motherboard does not fit in ${caseFormFactor} case`);
      }
    }
    
    return {
      isCompatible: errors.length === 0,
      warnings,
      errors,
    };
  } catch (error) {
    console.error('[v0] Compatibility check error:', error);
    return {
      isCompatible: true,
      warnings: [],
      errors: [],
    };
  }
};

module.exports = { checkCompatibility };
