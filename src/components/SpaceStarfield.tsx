"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  heartProgress: number; // 0 to 1
  scrollProgress: number; // 0 to 1
}

// Helper to create a circular glowing particle texture programmatically
const createStarTexture = (color = "rgba(255, 235, 180, 1)") => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.15, color);
    gradient.addColorStop(0.4, "rgba(255, 180, 50, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

// Component for Nebula clouds
function Nebulae() {
  const meshRef = useRef<THREE.Group>(null);
  
  const nebulaData = useMemo(() => {
    const items = [];
    const colors = ["#2b1055", "#510a32", "#190033", "#0d1b2a"];
    for (let i = 0; i < 4; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 10;
      const z = -10 - Math.random() * 10;
      const size = 15 + Math.random() * 15;
      const color = colors[i % colors.length];
      const rotationSpeed = (Math.random() - 0.5) * 0.05;
      items.push({ x, y, z, size, color, rotationSpeed });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.children.forEach((child, index) => {
      const data = nebulaData[index];
      child.rotation.z = state.clock.getElapsedTime() * data.rotationSpeed;
    });
  });

  return (
    <group ref={meshRef}>
      {nebulaData.map((data, index) => (
        <mesh key={index} position={[data.x, data.y, data.z]}>
          <planeGeometry args={[data.size, data.size]} />
          <meshBasicMaterial
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            color={data.color}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main Star field logic with heart morphing
function Stars({ heartProgress, scrollProgress }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => createStarTexture(), []);
  
  const starCount = 2000;
  const heartStarCount = 400; // Number of stars that will form the heart

  const { initialPositions, heartTargetPositions, speeds } = useMemo(() => {
    const initial = new Float32Array(starCount * 3);
    const target = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // 1. Initial Position (Random sphere distribution + depth)
      const r = 25 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() - 0.5) * 2);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = (Math.random() - 0.5) * 60 - 10; // spread along z

      initial[i * 3] = x;
      initial[i * 3 + 1] = y;
      initial[i * 3 + 2] = z;

      starSpeeds[i] = 0.05 + Math.random() * 0.15;

      // 2. Set default target same as initial
      target[i * 3] = x;
      target[i * 3 + 1] = y;
      target[i * 3 + 2] = z;
    }

    // 3. Define Heart shape targets for the first N stars
    for (let i = 0; i < heartStarCount; i++) {
      const t = (i / heartStarCount) * Math.PI * 2;
      // Parametric 2D heart formula
      // x = 16 * sin(t)^3
      // y = 13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)
      const heartX = 16 * Math.pow(Math.sin(t), 3);
      const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      // Scaling heart coordinates to fit on screen at Z=-10 (approx camera field)
      const scale = 0.14;
      target[i * 3] = heartX * scale;
      target[i * 3 + 1] = heartY * scale + 0.5; // Offset upwards slightly
      target[i * 3 + 2] = -8 + (Math.random() - 0.5) * 1.5; // Flatten depth near camera plane
    }

    return { initialPositions: initial, heartTargetPositions: target, speeds: starSpeeds };
  }, []);

  // Set initial attribute values
  useEffect(() => {
    if (pointsRef.current) {
      const positionAttr = new THREE.BufferAttribute(new Float32Array(initialPositions), 3);
      pointsRef.current.geometry.setAttribute("position", positionAttr);
    }
  }, [initialPositions]);

  // Handle interpolation and camera motion in render loop
  useFrame((state) => {
    if (!pointsRef.current || !pointsRef.current.geometry.attributes.position) return;

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Parallax pointer drift
    const mouseX = state.pointer.x * 2.0;
    const mouseY = state.pointer.y * 1.5;

    // Smoothly interpolate points towards heart positions if heartProgress > 0
    for (let i = 0; i < starCount; i++) {
      const startX = initialPositions[i * 3];
      const startY = initialPositions[i * 3 + 1];
      const startZ = initialPositions[i * 3 + 2];

      const targetX = heartTargetPositions[i * 3];
      const targetY = heartTargetPositions[i * 3 + 1];
      const targetZ = heartTargetPositions[i * 3 + 2];

      // Lerp positions based on heartProgress
      let currentX = THREE.MathUtils.lerp(startX, targetX, heartProgress);
      let currentY = THREE.MathUtils.lerp(startY, targetY, heartProgress);
      let currentZ = THREE.MathUtils.lerp(startZ, targetZ, heartProgress);

      // If NOT in heart shape, add subtle forward starfield animation
      if (heartProgress < 0.99) {
        // Move stars forward along Z to simulate moving through space
        let zOffset = (time * speeds[i] * 12) % 60;
        currentZ += zOffset;
        if (currentZ > 15) {
          // Recycle back in depth
          currentZ -= 60;
        }
      }

      // Add small orbital waving effect for constellation breathing
      if (heartProgress > 0.01 && i < heartStarCount) {
        const angle = time * 1.5 + i;
        const wave = Math.sin(angle) * 0.05 * heartProgress;
        currentX += wave;
        currentY += Math.cos(angle) * 0.05 * heartProgress;
      }

      positions[i * 3] = currentX;
      positions[i * 3 + 1] = currentY;
      positions[i * 3 + 2] = currentZ;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Apply scroll parallax to rotation
    pointsRef.current.rotation.y = time * 0.015 + mouseX * 0.04;
    pointsRef.current.rotation.x = -scrollProgress * 0.2 + mouseY * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.14}
        map={texture}
        transparent
        alphaTest={0.01}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Scene setup wrapper
function SceneContainer({ heartProgress, scrollProgress }: StarfieldProps) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} color="#ffe880" />
      <Stars heartProgress={heartProgress} scrollProgress={scrollProgress} />
      <Nebulae />
    </>
  );
}

// Exportable canvas component
export default function SpaceStarfield({ heartProgress, scrollProgress }: StarfieldProps) {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-[#020208] overflow-hidden">
      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ background: "#020208" }}
      >
        <SceneContainer heartProgress={heartProgress} scrollProgress={scrollProgress} />
      </Canvas>
      {/* Dynamic volumetric radial vignette gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,2,8,0.9)_100%)] pointer-events-none" />
    </div>
  );
}
