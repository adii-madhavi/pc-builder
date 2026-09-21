'use client';
import PCScene from './PCScene';
import type { Build } from '@/lib/store';
export function AssemblyCanvas({ components }: { components?: Build['components'] }) {
  return <PCScene components={components} />;
}
