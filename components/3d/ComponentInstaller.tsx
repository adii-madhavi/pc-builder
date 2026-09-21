'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InstallingComponent {
  id: string;
  type: string;
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  progress: number;
}

// Animated component installation
export function InstallableComponent({
  component,
  isInstalling,
}: {
  component: InstallingComponent;
  isInstalling: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    if (isInstalling && progressRef.current < 1) {
      progressRef.current += 0.02;
    }

    const progress = Math.min(progressRef.current, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out

    // Interpolate position
    groupRef.current.position.lerpVectors(
      new THREE.Vector3(...component.startPosition),
      new THREE.Vector3(...component.endPosition),
      easeProgress
    );

    // Rotation animation
    groupRef.current.rotation.y += 0.02;

    // Scale animation (shrink while installing)
    const scale = 1 - easeProgress * 0.1;
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} position={component.startPosition}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial
          color={component.type === 'gpu' ? '#ff6b00' : '#00ff88'}
          emissive={component.type === 'gpu' ? '#ff6b00' : '#00ff88'}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

export default InstallableComponent;
