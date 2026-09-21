'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExplodedComponentProps {
  basePosition: [number, number, number];
  explodePosition: [number, number, number];
  isExploded: boolean;
  children: React.ReactNode;
}

export function ExplodedComponent({
  basePosition,
  explodePosition,
  isExploded,
  children,
}: ExplodedComponentProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    const targetPosition = isExploded ? explodePosition : basePosition;
    const current = groupRef.current.position;

    // Smooth interpolation
    current.lerp(new THREE.Vector3(...targetPosition), 0.08);
  });

  return (
    <group ref={groupRef} position={basePosition}>
      {children}
    </group>
  );
}

interface ExplodedViewManagerProps {
  isExploded: boolean;
  onToggle: () => void;
}

export function ExplodedViewManager({ isExploded, onToggle }: ExplodedViewManagerProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={onToggle}
        className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors"
      >
        {isExploded ? 'Collapse' : 'Exploded'} View
      </button>
    </div>
  );
}

export default ExplodedComponent;
