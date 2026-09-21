'use client';

import React from 'react';

// PC Case
export function PCCase() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[3.5, 2.5, 2]} />
      <meshPhongMaterial color="#1a1a1a" wireframe={false} />
      
      {/* Case frame details */}
      <mesh position={[0, 0, -1.05]}>
        <boxGeometry args={[3.6, 2.6, 0.1]} />
        <meshPhongMaterial color="#00ff88" wireframe={true} />
      </mesh>
    </mesh>
  );
}

// CPU Cooler
export function CoolerComponent({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      {/* Tower cooler representation */}
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.5]} />
          <meshPhongMaterial color="#00ccff" />
        </mesh>
        {/* Heat pipes */}
        {[0, 0.15, -0.15].map((offset) => (
          <mesh key={offset} position={[offset, 0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6]} />
            <meshPhongMaterial color="#ff00ff" />
          </mesh>
        ))}
      </group>
    </mesh>
  );
}

// CPU
export function CPUComponent({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.4, 0.1, 0.4]} />
      <meshPhongMaterial color="#ffaa00" />
      
      {/* CPU pins detail */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[i * 0.06 - 0.15, -0.08, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.02]} />
          <meshPhongMaterial color="#888888" />
        </mesh>
      ))}
    </mesh>
  );
}

// GPU
export function GPUComponent({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      {/* GPU card */}
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.3, 0.8]} />
          <meshPhongMaterial color="#ff0088" />
        </mesh>
        {/* Cooling fins */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[i * 0.45 - 0.7, 0.2, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.8]} />
            <meshPhongMaterial color="#00ff88" />
          </mesh>
        ))}
      </group>
    </mesh>
  );
}

// Motherboard
export function MotherboardComponent({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[2.4, 1.8, 0.08]} />
      <meshPhongMaterial color="#2a2a2a" />
      
      {/* PCIe slots */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[1, -0.6 + i * 0.4, 0.05]}>
          <boxGeometry args={[0.15, 0.15, 0.03]} />
          <meshPhongMaterial color="#555555" />
        </mesh>
      ))}
      
      {/* CPU Socket */}
      <mesh position={[-0.8, 0.5, 0.05]}>
        <boxGeometry args={[0.5, 0.5, 0.03]} />
        <meshPhongMaterial color="#00ccff" />
      </mesh>
    </mesh>
  );
}

// RAM Sticks
export function RAMComponent({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.3, 0.6, 0.15]} />
      <meshPhongMaterial color="#00ff88" />
      
      {/* RAM chip details */}
      {[0, 0.15].map((offset) => (
        <mesh key={offset} position={[0, 0.15, offset - 0.075]}>
          <boxGeometry args={[0.25, 0.08, 0.02]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
      ))}
    </mesh>
  );
}

// Power Supply
export function PSUComponent({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.8, 0.4, 1]} />
      <meshPhongMaterial color="#8b0000" />
      
      {/* Cooling fan */}
      <mesh position={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
        <meshPhongMaterial color="#333333" />
      </mesh>
    </mesh>
  );
}

// Storage (SSD/HDD)
export function StorageComponent({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 0.15, 0.8]} />
      <meshPhongMaterial color="#00ccff" />
      
      {/* Connector */}
      <mesh position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.08, 0.3]} />
        <meshPhongMaterial color="#ffaa00" />
      </mesh>
    </mesh>
  );
}
