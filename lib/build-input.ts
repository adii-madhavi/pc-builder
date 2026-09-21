import { mockDB } from './mock-db';
import { componentTypes, summarizeBuild } from './build-utils';
import type { Build } from './store';

export function buildInput(body: any) {
  if (!body || typeof body.name !== 'string' || !body.name.trim() || body.name.length > 120) throw new Error('Enter a build name of 1–120 characters.');
  if (!body.components || typeof body.components !== 'object' || Array.isArray(body.components)) throw new Error('Select components before saving.');
  const components: Build['components'] = {};
  for (const type of componentTypes) {
    const raw = body.components[type];
    if (raw == null) continue;
    const values = Array.isArray(raw) ? raw : [raw];
    if (values.length > (type === 'ram' || type === 'storage' ? 8 : 1)) throw new Error('Too many components.');
    const parts = values.map(value => {
      const part = mockDB.getComponent(typeof value === 'string' ? value : value?._id);
      if (!part || part.type.toLowerCase() !== type) throw new Error('Unknown component. Select it again from the catalog.');
      return part;
    });
    if (parts.length) Object.assign(components, { [type]: type === 'ram' || type === 'storage' ? parts : parts[0] });
  }
  if (!Object.keys(components).length) throw new Error('Select components before saving.');
  const summary = summarizeBuild(components);
  const psuWattage = components.psu?.specs?.wattage;
  return {
    name: body.name.trim(), description: typeof body.description === 'string' ? body.description.slice(0, 2000) : '',
    components, totalCost: summary.totalCost, isPublic: body.isPublic === true, compatibility: summary.compatibility,
    power: psuWattage ? { estimatedDraw: summary.estimatedWatts, psuWattage, headroom: (psuWattage - summary.estimatedWatts) / psuWattage * 100, adequate: psuWattage >= summary.recommendedWatts } : undefined,
  };
}
