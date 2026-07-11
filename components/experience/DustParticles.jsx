"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function DustParticles() {
  const pointsRef = useRef(null);
  const positions = useMemo(() => {
    const count = 130;
    const data = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      data[index * 3] = (Math.random() - 0.5) * 4.8;
      data[index * 3 + 1] = Math.random() * 2.5 + 0.2;
      data[index * 3 + 2] = Math.random() * 2.6 + 0.25;
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.018;
    pointsRef.current.position.y = Math.sin(clock.elapsedTime * 0.22) * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#f7ead2"
        opacity={0.18}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
