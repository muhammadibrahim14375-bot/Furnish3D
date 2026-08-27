import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import type { Product } from '../types';

function Sofa() {
  return (
    <group position={[0, 0.35, 0]}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[2.2, 0.4, 0.9]} />
        <meshStandardMaterial color="#6b7f71" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 0.7, -0.3]}>
        <boxGeometry args={[2.2, 0.7, 0.28]} />
        <meshStandardMaterial color="#5d7164" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[-1.05, 0.45, 0.05]}>
        <boxGeometry args={[0.22, 0.45, 0.8]} />
        <meshStandardMaterial color="#5d7164" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[1.05, 0.45, 0.05]}>
        <boxGeometry args={[0.22, 0.45, 0.8]} />
        <meshStandardMaterial color="#5d7164" roughness={0.85} />
      </mesh>
      {[
        [-0.9, -0.1, 0.35],
        [0.9, -0.1, 0.35],
        [-0.9, -0.1, -0.35],
        [0.9, -0.1, -0.35],
      ].map((pos, i) => (
        <mesh key={i} castShadow position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.05, 0.05, 0.25, 16]} />
          <meshStandardMaterial color="#5c4033" metalness={0.2} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0.4, 0]}>
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        <meshStandardMaterial color="#d9c3a5" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.55, -0.28]}>
        <boxGeometry args={[0.7, 0.9, 0.1]} />
        <meshStandardMaterial color="#cbb396" roughness={0.7} />
      </mesh>
      {[
        [-0.28, -0.35, 0.28],
        [0.28, -0.35, 0.28],
        [-0.28, -0.35, -0.28],
        [0.28, -0.35, -0.28],
      ].map((pos, i) => (
        <mesh key={i} castShadow position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />
          <meshStandardMaterial color="#4a3428" />
        </mesh>
      ))}
    </group>
  );
}

function Table() {
  return (
    <group position={[0, 0.35, 0]}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[1.6, 0.08, 0.9]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.55} />
      </mesh>
      {[
        [-0.65, -0.1, 0.35],
        [0.65, -0.1, 0.35],
        [-0.65, -0.1, -0.35],
        [0.65, -0.1, -0.35],
      ].map((pos, i) => (
        <mesh key={i} castShadow position={pos as [number, number, number]}>
          <boxGeometry args={[0.08, 0.55, 0.08]} />
          <meshStandardMaterial color="#3f2a1d" />
        </mesh>
      ))}
    </group>
  );
}

function Bed() {
  return (
    <group position={[0, 0.25, 0]}>
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[2, 0.3, 1.4]} />
        <meshStandardMaterial color="#e8e0d5" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.55, -0.6]}>
        <boxGeometry args={[2, 0.8, 0.12]} />
        <meshStandardMaterial color="#7a6248" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[2.05, 0.15, 1.45]} />
        <meshStandardMaterial color="#5c4634" />
      </mesh>
    </group>
  );
}

function Cabinet() {
  return (
    <group position={[0, 0.45, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.8, 0.9, 0.5]} />
        <meshStandardMaterial color="#6d5844" roughness={0.65} />
      </mesh>
      <mesh position={[-0.45, 0, 0.26]}>
        <boxGeometry args={[0.8, 0.75, 0.02]} />
        <meshStandardMaterial color="#81684f" />
      </mesh>
      <mesh position={[0.45, 0, 0.26]}>
        <boxGeometry args={[0.8, 0.75, 0.02]} />
        <meshStandardMaterial color="#81684f" />
      </mesh>
    </group>
  );
}

function FurnitureModel({ categorySlug }: { categorySlug?: string }) {
  const Model = useMemo(() => {
    switch (categorySlug) {
      case 'chairs':
        return Chair;
      case 'tables':
        return Table;
      case 'beds':
        return Bed;
      case 'storage':
        return Cabinet;
      case 'sofas':
      default:
        return Sofa;
    }
  }, [categorySlug]);

  return <Model />;
}

function Scene({ categorySlug }: { categorySlug?: string }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[4, 6, 3]}
        intensity={1.15}
        shadow-mapSize={[1024, 1024]}
      />
      <FurnitureModel categorySlug={categorySlug} />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.45}
        scale={8}
        blur={2.5}
        far={4}
      />
      <Environment preset="apartment" />
      <OrbitControls
        enablePan={false}
        minPolarAngle={0.4}
        maxPolarAngle={1.45}
        minDistance={2.2}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </>
  );
}

export default function ProductViewer3D({ product }: { product: Product }) {
  const categorySlug = product.category?.slug;

  return (
    <div className="viewer-shell">
      <span className="viewer-hint">Drag to rotate · Scroll to zoom</span>
      <Canvas
        shadows
        camera={{ position: [2.8, 2.1, 3.2], fov: 42 }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#00000000']} />
        <Suspense fallback={null}>
          <Scene categorySlug={categorySlug} />
        </Suspense>
      </Canvas>
    </div>
  );
}
