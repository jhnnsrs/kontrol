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

interface ServiceRequirement {
  key: string;
  description?: string;
}

interface ServiceLogoProps {
  service: ServiceRequirement | string; 
  className?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark';
}

const SinglePoly: React.FC<{ type: PolyType; color: string }> = ({ type, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
      if (meshRef.current) {
          meshRef.current.rotation.x += delta * 0.2;
          meshRef.current.rotation.y += delta * 0.3;
      }
  });

  const Material = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.6}
      metalness={0.9}
      roughness={0.1}
      transparent={true}
      opacity={0.6}
      blending={THREE.AdditiveBlending}
      side={THREE.DoubleSide}
      flatShading={true}
    />
  );

  const scale = 1.8;
  const args: [number, number] = [scale, 0];

  const renderGeometry = () => {
    switch (type) {
      case 'octa': return <Octahedron args={args} ref={meshRef}>{Material}</Octahedron>;
      case 'dodeca': return <Dodecahedron args={args} ref={meshRef}>{Material}</Dodecahedron>;
      case 'icosa': default: return <Icosahedron args={args} ref={meshRef}>{Material}</Icosahedron>;
    }
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      {renderGeometry()}
    </Float>
  );
};

const ServiceLogo: React.FC<ServiceLogoProps> = ({ 
  service, 
  className, 
  style, 
  theme = 'light' 
}) => {
  const isDark = theme === 'dark';
  const serviceKey = typeof service === 'string' ? service : service.key;

  // Use the new palette utility
  const { color, type } = useMemo(() => ({
    color: stringToPaletteColor(serviceKey),
    type: getPolyType(serviceKey)
  }), [serviceKey]);

  return (
    <div 
      className={className} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '150px', 
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

        <SinglePoly type={type} color={color} />

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

export default ServiceLogo;