"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useLight } from "@/components/providers/LightProvider";

const MODEL_PATH = "/models/AnisotropyBarnLamp.glb";

function RealLampModel() {
  const { scene } = useGLTF(MODEL_PATH);

  return (
    <primitive
      object={scene}
      scale={3.15}
      rotation={[0, Math.PI * 0.0, -Math.PI * -0.0]}
      position={[0, 0.7, 0.1]}
    />
  );
}

function FallbackLamp({ glowMaterialRef }) {
  const armCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.42, -0.04),
        new THREE.Vector3(0, 0.42, 0.18),
        new THREE.Vector3(0, 0.22, 0.32),
        new THREE.Vector3(0, 0.02, 0.28)
      ]),
    []
  );

  const metalMaterial = (
    <meshStandardMaterial color="#1e1d1a" metalness={0.74} roughness={0.28} />
  );

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.38, -0.035]}>
        <boxGeometry args={[0.34, 0.22, 0.08]} />
        <meshStandardMaterial color="#20211e" metalness={0.42} roughness={0.42} />
      </mesh>

      <mesh castShadow>
        <tubeGeometry args={[armCurve, 32, 0.026, 18, false]} />
        {metalMaterial}
      </mesh>

      <mesh castShadow receiveShadow position={[0, -0.02, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.43, 0.46, 96, 1, true]} />
        <meshStandardMaterial
          color="#181814"
          metalness={0.82}
          roughness={0.24}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, -0.02, 0.43]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.018, 16, 96]} />
        {metalMaterial}
      </mesh>

      <mesh castShadow receiveShadow position={[0, -0.02, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 48]} />
        <meshStandardMaterial color="#151512" metalness={0.7} roughness={0.24} />
      </mesh>

      <mesh position={[0, -0.04, 0.31]}>
        <sphereGeometry args={[0.13, 32, 24]} />
        <meshStandardMaterial
          ref={glowMaterialRef}
          color="#fff4d4"
          emissive="#ffc36f"
          emissiveIntensity={0}
          roughness={0.22}
          toneMapped={false}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, -0.02, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.01, 12, 96]} />
        <meshStandardMaterial color="#11110f" metalness={0.72} roughness={0.32} />
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
      {!hasModel && (
        <mesh castShadow receiveShadow position={[0, 0.02, -0.08]}>
          <boxGeometry args={[0.72, 0.72, 0.08]} />
          <meshStandardMaterial color="#262927" metalness={0.18} roughness={0.62} />
        </mesh>
      )}

      {hasModel ? <RealLampModel /> : <FallbackLamp glowMaterialRef={glowMaterialRef} />}

      {hasModel && (
        <mesh position={[0.5, -0.5, 0.22]}>
          <sphereGeometry args={[0.03, 24, 16]} />
          <meshStandardMaterial
            ref={glowMaterialRef}
            color="#fff3d0"
            emissive="#ffc36f"
            emissiveIntensity={0}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}
