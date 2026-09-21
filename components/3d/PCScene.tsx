'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { ExplodedComponent } from './ExplodedView';
import type { Build } from '@/lib/store';
import type { RGBSettings } from './RGBController';

interface SceneProps {
  components?: Build['components'];
  isExploded?: boolean;
  powerOn?: boolean;
  rgbSettings?: RGBSettings;
}

function Box({ size, position = [0, 0, 0], color = '#252c38' }: { size: [number, number, number]; position?: [number, number, number]; color?: string }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.45} /></mesh>;
}

function Fan({ position, powerOn, settings }: { position: [number, number, number]; powerOn: boolean; settings: RGBSettings }) {
  const blades = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({clock}, delta) => {
    if (blades.current && powerOn) blades.current.rotation.z += delta * 12;
    if (!material.current) return;
    const t = clock.elapsedTime;
    material.current.color.set(settings.color);
    if (settings.mode === 'rainbow') material.current.color.setHSL((t * 0.15 + position[1]) % 1, 1, 0.5);
    material.current.emissive.copy(material.current.color);
    const pulse = settings.mode === 'breathing' ? (Math.sin(t * 2) + 1) / 2 : settings.mode === 'wave' ? (Math.sin(t * 3 + position[1] * 5) + 1) / 2 : 1;
    material.current.emissiveIntensity = powerOn ? settings.intensity * pulse : 0;
  });
  return <group position={position}>
    <mesh><torusGeometry args={[0.18, 0.022, 12, 32]} /><meshStandardMaterial ref={material} color={settings.color} /></mesh>
    <group ref={blades}>
      {[0, 1, 2, 3, 4].map(i => <group key={i} rotation={[0, 0, i * Math.PI * 2 / 5]}><Box size={[0.06, 0.13, 0.025]} position={[0, 0.065, 0]} color="#526073" /></group>)}
    </group>
    <mesh><cylinderGeometry args={[0.04, 0.04, 0.04, 16]} /><meshStandardMaterial color="#10131a" /></mesh>
  </group>;
}

export function PCScene({ components = {}, isExploded = false, powerOn = false, rgbSettings = { mode: 'static', color: '#00ff88', intensity: 1 } }: SceneProps) {
  const exploded = (base: [number, number, number], offset: [number, number, number], child: React.ReactNode) => <ExplodedComponent basePosition={base} explodePosition={offset} isExploded={isExploded}>{child}</ExplodedComponent>;
  return <div className="h-full w-full" aria-label="Interactive 3D preview of selected PC parts">
    <Canvas dpr={[1, 1.5]} shadows camera={{ position: [3, 2, 4.5], fov: 45 }} fallback={<p className="p-6">3D preview requires WebGL. You can still select and save parts.</p>}>
      <color attach="background" args={['#111723']} />
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 5, 5]} intensity={3} castShadow />
      <directionalLight position={[-3, 1, 2]} intensity={1.5} color="#91b8ff" />
      <Grid position={[0, -1.23, 0]} args={[10, 10]} cellSize={0.25} sectionSize={1} cellColor="#283245" sectionColor="#435677" fadeDistance={12} infiniteGrid />
      {components.case && <group>
        <Box size={[1.65, 0.08, 1]} position={[0, -1.14, 0]} />
        <Box size={[1.65, 0.08, 1]} position={[0, 1.14, 0]} />
        <Box size={[1.65, 2.2, 0.04]} position={[0, 0, -0.49]} color="#303a4b" />
        {[-0.78, 0.78].map(x => <Box key={x} size={[0.07, 2.2, 0.07]} position={[x, 0, 0.46]} />)}
        {[-0.65, 0.65].map(x => <Box key={x} size={[0.16, 0.09, 0.7]} position={[x, -1.21, 0]} />)}
        <Fan position={[0.52, 0.7, 0.35]} powerOn={powerOn} settings={rgbSettings} />
        <Fan position={[0.52, 0.2, 0.35]} powerOn={powerOn} settings={rgbSettings} />
      </group>}
      {components.motherboard && exploded([-0.18, 0.2, -0.4], [-1.25, 0.2, -0.5], <group><Box size={[1.1, 1.45, 0.055]} color="#164b42" />{[-0.48, -0.25].map(y => <Box key={y} size={[0.7, 0.05, 0.05]} position={[0, y, 0.04]} color="#aaaeb6" />)}<Box size={[0.32, 0.32, 0.035]} position={[-0.18, 0.36, 0.05]} color="#30343c" /></group>)}
      {components.cpu && exploded([-0.36, 0.56, -0.3], [-0.7, 1.65, 0.1], <Box size={[0.27, 0.27, 0.055]} color="#c1c8d0" />)}
      {components.ram?.map((part, i) => <group key={part._id + i}>{exploded([0.12 + i * 0.12, 0.48, -0.27], [1.3 + i * 0.15, 1.1, 0], <group><Box size={[0.08, 0.72, 0.15]} color="#2a364a" /><Box size={[0.09, 0.65, 0.035]} position={[0, 0, 0.09]} color={powerOn ? rgbSettings.color : '#77808d'} /></group>)}</group>)}
      {components.gpu && exploded([-0.18, -0.25, 0], [-1.35, -0.4, 0.9], <group><Box size={[1.15, 0.28, 0.6]} color="#303947" /><Fan position={[-0.28, 0, 0.32]} powerOn={powerOn} settings={rgbSettings} /><Fan position={[0.25, 0, 0.32]} powerOn={powerOn} settings={rgbSettings} /></group>)}
      {components.psu && exploded([-0.4, -0.87, 0], [-0.8, -1, 1.5], <Box size={[0.65, 0.42, 0.7]} color="#454b55" />)}
      {components.storage?.map((part, i) => <group key={part._id + i}>{exploded([0.2, -0.59 - i * 0.13, -0.3], [1.4, -0.6 - i * 0.2, 0.5], <Box size={[0.45, 0.12, 0.035]} color="#2e8295" />)}</group>)}
      {components.cooler && exploded([-0.36, 0.56, 0.02], [-0.2, 1.65, 1.2], <group>{[-0.15, -0.09, -0.03, 0.03, 0.09, 0.15].map(y => <Box key={y} size={[0.4, 0.025, 0.4]} position={[0, y, 0]} color="#aab2bb" />)}<Fan position={[0, 0, 0.23]} powerOn={powerOn} settings={rgbSettings} /></group>)}
      <OrbitControls makeDefault minDistance={2.5} maxDistance={9} maxPolarAngle={Math.PI * 0.85} />
    </Canvas>
    {!Object.values(components).some(value => Array.isArray(value) ? value.length : value) && <p className="pointer-events-none absolute bottom-6 left-0 w-full text-center text-sm text-slate-300">Choose components to see your assembly</p>}
  </div>;
}
export default PCScene;
