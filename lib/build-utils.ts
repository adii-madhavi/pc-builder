import type { Build } from './store';

export const componentTypes = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'cooler', 'case'] as const;

export function summarizeBuild(components: Build['components']) {
  const parts = Object.values(components).flat().filter(Boolean);
  const totalCost = parts.reduce((sum, part) => sum + part.price, 0);
  const errors: string[] = [];
  const warnings = componentTypes.filter(type => !components[type] || (Array.isArray(components[type]) && !components[type].length)).map(type => `Select a ${type} component.`);
  const { cpu, motherboard, ram, psu, gpu, cooler, case: chassis } = components;
  if (cpu && motherboard && cpu.specs?.socket !== motherboard.specs?.socket) errors.push('CPU and motherboard sockets do not match.');
  if (motherboard && ram?.some(part => part.specs?.type !== motherboard.specs?.ramType)) errors.push('RAM type does not match the motherboard.');
  if (cpu && cooler && !cooler.specs?.sockets?.includes(cpu.specs?.socket)) errors.push('Cooler does not support the CPU socket.');
  if (cooler && chassis && cooler.specs?.height > chassis.specs?.maxCoolerHeight) errors.push('Cooler is too tall for the case.');
  if (gpu && chassis && gpu.specs?.length > chassis.specs?.maxGpuLength) errors.push('GPU is too long for the case.');
  const estimatedWatts = parts.length ? (cpu?.tdp || 0) + (gpu?.power || 0) + 50 : 0;
  const recommendedWatts = Math.ceil(estimatedWatts * 1.25);
  if (psu && psu.specs?.wattage < recommendedWatts) errors.push(`Power supply is too small; allow at least ${recommendedWatts}W.`);
  return { totalCost, estimatedWatts, recommendedWatts, compatibility: { isCompatible: errors.length === 0, errors, warnings } };
}
