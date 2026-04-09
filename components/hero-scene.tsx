"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────
   HERO 3D SCENE — Morphing crystal with parallax
   
   Polished WebGL scene using react-three-fiber:
   • MeshDistortMaterial for smooth organic morphing  
   • Mouse-reactive camera parallax
   • Float animation for subtle bobbing
   • Custom wireframe overlay for editorial feel
   • Accent-colored lighting rig
   ───────────────────────────────────────────────────── */

/* ── Mouse-reactive camera rig ── */
function CameraRig() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useFrame(() => {
    // Smooth lerp toward mouse position
    smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.02;
    smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.02;

    camera.position.x = smoothRef.current.x * 0.8;
    camera.position.y = -smoothRef.current.y * 0.5;
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return null;
}

/* ── Morphing crystal geometry ── */
function MorphingCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Slow idle rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color="#C0783A"
          emissive="#1a0800"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.8}
          distort={0.25}
          speed={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

/* ── Wireframe overlay (same geometry, wireframe material) ── */
function WireframeOverlay() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.82}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial
          color="#C0783A"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </Float>
  );
}

/* ── Ambient particles ── */
function AmbientParticles() {
  const count = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread in a sphere around the center
      const r = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = 0.01 + Math.random() * 0.03;
    }
    return s;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#F2EDE6"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Lighting rig ── */
function Lighting() {
  return (
    <>
      {/* Key light — warm accent */}
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.2}
        color="#C0783A"
      />
      {/* Fill light — cool contrast */}
      <directionalLight
        position={[-3, -2, -3]}
        intensity={0.4}
        color="#6B8DA6"
      />
      {/* Rim light — accent edge highlight */}
      <pointLight position={[0, 5, -5]} intensity={0.6} color="#C0783A" />
      {/* Ambient base */}
      <ambientLight intensity={0.15} color="#F2EDE6" />
    </>
  );
}

/* ── Main exported component ── */
export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <CameraRig />
        <Lighting />
        <MorphingCrystal />
        <WireframeOverlay />
        <AmbientParticles />
      </Canvas>
    </div>
  );
}
