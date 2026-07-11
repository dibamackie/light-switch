"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLight } from "@/components/providers/LightProvider";

const MODEL_PATH = "/models/AnisotropyBarnLamp.glb";

function RealLampModel() {
  const { scene } = useGLTF(MODEL_PATH);

  return (
    <primitive
      object={scene}
      scale={0.42}
      rotation={[0, Math.PI * 0.5, 0]}
      position={[-0.02, -0.08, 0.03]}
    />
  );
}

function FallbackLamp() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.02, -0.035]}>
        <cylinderGeometry args={[0.22, 0.22, 0.09, 48]} />
        <meshStandardMaterial color="#2a2a28" metalness={0.35} roughness={0.48} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.02, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.22, 0.34, 64, 1, true]} />
        <meshStandardMaterial color="#232321" metalness={0.55} roughness={0.34} side={THREE.DoubleSide} />
      </mesh>
      <mesh castShadow position={[0, 0.28, -0.04]}>
        <cylinderGeometry args={[0.045, 0.045, 0.45, 24]} />
        <meshStandardMaterial color="#242424" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.5, -0.04]}>
        <boxGeometry args={[0.42, 0.08, 0.12]} />
        <meshStandardMaterial color="#252522" metalness={0.4} roughness={0.44} />
      </mesh>
    </group>
  );
}

export default function Lamp({ position }) {
  const { registerTarget } = useLight();
  const [hasModel, setHasModel] = useState(false);
  const glowMaterialRef = useRef(null);

  useEffect(() => {
    let active = true;

    fetch("/api/model-status")
      .then((response) => response.json())
      .then((status) => {
        if (!active) return;
        setHasModel(status.hasLampModel);
        if (status.hasLampModel) useGLTF.preload(MODEL_PATH);
      })
      .catch(() => {
        if (active) setHasModel(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    registerTarget("emissiveMaterial", glowMaterialRef.current);
    return () => registerTarget("emissiveMaterial", null);
  }, [registerTarget]);

  return (
    <group position={position} rotation={[0, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.02, -0.08]}>
        <boxGeometry args={[0.72, 0.72, 0.08]} />
        <meshStandardMaterial color="#262927" metalness={0.18} roughness={0.62} />
      </mesh>

      {hasModel ? <RealLampModel /> : <FallbackLamp />}

      <mesh position={[0, -0.1, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.19, 48]} />
        <meshStandardMaterial
          ref={glowMaterialRef}
          color="#fff3d0"
          emissive="#ffc36f"
          emissiveIntensity={0}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
