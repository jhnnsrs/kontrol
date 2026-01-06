import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Environment, 
  PerspectiveCamera, 
  Icosahedron,
  Octahedron,
  Dodecahedron
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { stringToPaletteColor, getPolyType, type PolyType } from '@/lib/logoUtils';
import type { ManifestFragment } from '@/api/graphql';

// --- Types ---
export interface Manifest {
    identifier: string;
    requirements?: Array<{ key: string, description?: string }>;
}

interface AutoLogoProps {
  manifest: ManifestFragment;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark';
}

// --- Shape Sub-Component ---
interface PolyShapeProps {
  type: PolyType;
  color: string;
  position: [number, number, number];
  scale: number;
  index: number;
}

const PolyShape: React.FC<PolyShapeProps> = ({ type, color, position, scale, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
      if (meshRef.current) {
          meshRef.current.rotation.x += delta * (0.2 + index * 0.05);
          meshRef.current.rotation.y += delta * (0.3 + index * 0.02);
      }
  });

  const Material = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.6} // Increased for vibrant palette
      metalness={0.9}
      roughness={0.1}
      transparent={true}
      opacity={0.6}
      blending={THREE.AdditiveBlending}
      side={THREE.DoubleSide}
      flatShading={true}
    />
  );

  const geoArgs: [number, number] = [scale, 0]; 

  const renderGeometry = () => {
    switch (type) {
      case 'octa': return <Octahedron args={geoArgs} ref={meshRef}>{Material}</Octahedron>;
      case 'dodeca': return <Dodecahedron args={geoArgs} ref={meshRef}>{Material}</Dodecahedron>;
      case 'icosa': default: return <Icosahedron args={geoArgs} ref={meshRef}>{Material}</Icosahedron>;
    }
  };

  return (
    <Float 
      position={position} 
      speed={1 + index * 0.1} 
      rotationIntensity={0.5} 
      floatIntensity={0.5}
    >
      {renderGeometry()}
    </Float>
  );
};

// --- Main Component ---
const AutoLogo: React.FC<AutoLogoProps> = ({ 
  manifest, 
  className, 
  style, 
  theme = 'light' 
}) => {
  const isDark = theme === 'dark';

  const shapesData = useMemo(() => {
    const sources = (manifest.requirements && manifest.requirements.length > 0)
      ? manifest.requirements 
      : [{ key: manifest.identifier, description: 'Core' }];

    const slice = sources.slice(0, 5);
    
    return slice.map((req, i) => {
      const hash = req.key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const x = Math.sin(hash) * 0.8; 
      const y = Math.cos(hash * 0.5) * 0.8;
      const z = Math.sin(hash * 1.2) * 0.5;
      const scale = 0.8 + (hash % 4) / 10;

      return {
        key: req.key,
        color: stringToPaletteColor(req.key), // Using palette logic
        type: getPolyType(req.key),
        position: [x, y, z] as [number, number, number],
        scale,
      };
    });
  }, [manifest]);

  return (
    <div 
      className={className} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        background: isDark ? '#050505' : '#f0f0f0', 
        transition: 'background 0.3s ease',
        borderRadius: '12px',
        overflow: 'hidden',
        ...style 
      }}
    >
      <Canvas gl={{ antialias: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Environment preset={isDark ? "night" : "city"} />

        <group>
           {shapesData.map((shape, index) => (
              <PolyShape
                key={`${shape.key}-${index}`}
                index={index}
                type={shape.type}
                color={shape.color}
                position={shape.position}
                scale={shape.scale}
              />
          ))}
        </group>

        <EffectComposer disableNormalPass>
            <Bloom 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                height={300} 
                intensity={isDark ? 1.5 : 0.8} 
            />
            <ChromaticAberration offset={[THREE.Vector2, THREE.Vector2] as any} radialModulation={false} modulationOffset={0} />
            <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default AutoLogo;