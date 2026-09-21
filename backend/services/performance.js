// Performance and thermal analysis service

const calculatePerformance = async (components) => {
  try {
    let cpuScore = 0;
    let gpuScore = 0;
    
    // Calculate CPU score
    if (components.cpu) {
      const cpu = components.cpu;
      if (cpu.cpu) {
        const clockGHz = (cpu.cpu.clockSpeed || 3) / 1000;
        const coreCount = cpu.cpu.cores || 4;
        
        // Simple scoring formula
        cpuScore = Math.round(clockGHz * coreCount * 100);
      }
    }
    
    // Calculate GPU score
    if (components.gpu) {
      const gpu = components.gpu;
      if (gpu.gpu) {
        const vramGB = gpu.gpu.vram || 2;
        const cudaCores = gpu.gpu.cudaCores || 2000;
        
        // Simple scoring formula
        gpuScore = Math.round((vramGB * cudaCores) / 10);
      }
    }
    
    // Calculate bottleneck
    let bottleneck = {
      percentage: 0,
      component: 'Balanced',
    };
    
    if (cpuScore > 0 && gpuScore > 0) {
      const ratio = gpuScore / cpuScore;
      if (ratio > 1.3) {
        bottleneck = {
          percentage: Math.round((ratio - 1) * 50),
          component: 'CPU',
        };
      } else if (ratio < 0.7) {
        bottleneck = {
          percentage: Math.round((1 - ratio) * 50),
          component: 'GPU',
        };
      }
    }
    
    // Estimate gaming FPS
    const gamingFps = {
      minecraft: cpuScore > 500 ? Math.round(144 + (cpuScore / 10)) : Math.round(60 + (cpuScore / 20)),
      fortnite: gpuScore > 10000 ? Math.round(100 + (gpuScore / 500)) : Math.round(60 + (gpuScore / 500)),
      cyberpunk: gpuScore > 15000 ? Math.round(80 + (gpuScore / 1000)) : Math.round(40 + (gpuScore / 1500)),
      elden_ring: gpuScore > 12000 ? Math.round(120) : Math.round(60 + (gpuScore / 500)),
    };
    
    const overallScore = Math.round((cpuScore + gpuScore) / 2);
    
    return {
      cpuScore,
      gpuScore,
      overallScore,
      bottleneck,
      gamingFps,
    };
  } catch (error) {
    console.error('[v0] Performance calculation error:', error);
    return {
      cpuScore: 0,
      gpuScore: 0,
      overallScore: 0,
      bottleneck: { percentage: 0, component: 'Unknown' },
      gamingFps: {},
    };
  }
};

const calculateThermal = async (components) => {
  try {
    let cpuTDP = 0;
    let gpuTDP = 0;
    let coolerCapability = 0;
    
    // Get component TDPs
    if (components.cpu && components.cpu.cpu) {
      cpuTDP = components.cpu.cpu.tdp || 65;
    }
    
    if (components.gpu && components.gpu.gpu) {
      gpuTDP = components.gpu.gpu.tdp || 150;
    }
    
    if (components.cooler && components.cooler.cooler) {
      coolerCapability = components.cooler.cooler.tdpCapability || 150;
    }
    
    const totalTDP = cpuTDP + gpuTDP;
    
    // Estimate case airflow
    let caseAirflow = 'Standard';
    if (components.case && components.case.case) {
      if (components.case.case.formFactor === 'Mini-ITX') {
        caseAirflow = 'Limited';
      } else if (components.case.case.formFactor === 'E-ATX') {
        caseAirflow = 'Excellent';
      }
    }
    
    // Calculate thermal headroom
    const thermalHeadroom = Math.round(((coolerCapability - cpuTDP) / coolerCapability) * 100);
    
    const recommendations = [];
    
    if (cpuTDP > coolerCapability * 0.8) {
      recommendations.push('CPU cooler may struggle with this CPU');
    }
    
    if (totalTDP > 350 && caseAirflow === 'Limited') {
      recommendations.push('Case airflow may be limited for this build\'s thermal load');
    }
    
    if (thermalHeadroom < 20) {
      recommendations.push('Limited thermal headroom - consider upgrading cooler');
    }
    
    return {
      cpuTDP,
      gpuTDP,
      totalTDP,
      caseAirflow,
      thermalHeadroom: Math.max(0, thermalHeadroom),
      recommendations,
    };
  } catch (error) {
    console.error('[v0] Thermal calculation error:', error);
    return {
      cpuTDP: 0,
      gpuTDP: 0,
      totalTDP: 0,
      caseAirflow: 'Unknown',
      thermalHeadroom: 0,
      recommendations: [],
    };
  }
};

const calculatePower = async (components) => {
  try {
    let systemPowerDraw = 0;
    let psuWattage = 850; // Default
    
    // Estimate system power draw
    if (components.cpu && components.cpu.cpu) {
      systemPowerDraw += (components.cpu.cpu.tdp || 65) * 1.5; // CPU at load
    } else {
      systemPowerDraw += 100;
    }
    
    if (components.gpu && components.gpu.gpu) {
      systemPowerDraw += (components.gpu.gpu.tdp || 150) * 1.2; // GPU at load
    } else {
      systemPowerDraw += 100;
    }
    
    // Add motherboard, storage, cooler
    systemPowerDraw += 50;
    
    // Get PSU wattage
    if (components.psu && components.psu.psu) {
      psuWattage = components.psu.psu.wattage || 850;
    }
    
    const headroom = Math.round(((psuWattage - systemPowerDraw) / psuWattage) * 100);
    const adequate = systemPowerDraw < psuWattage * 0.9; // 90% rule
    
    return {
      estimatedDraw: Math.round(systemPowerDraw),
      psuWattage,
      headroom: Math.max(0, headroom),
      adequate,
    };
  } catch (error) {
    console.error('[v0] Power calculation error:', error);
    return {
      estimatedDraw: 0,
      psuWattage: 850,
      headroom: 0,
      adequate: true,
    };
  }
};

module.exports = {
  calculatePerformance,
  calculateThermal,
  calculatePower,
};
