"use client";

import { ContactShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useLight } from "@/components/providers/LightProvider";
import CameraRig from "./CameraRig";
import DustParticles from "./DustParticles";
import Lamp from "./Lamp";
import Lighting from "./Lighting";
import LightSwitch from "./LightSwitch";

function makeSurfaceTexture(kind) {
  const size = 256;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;

  context.fillStyle = kind === "wall" ? "#d9d3c6" : "#bfb9ae";
  context.fillRect(0, 0, size, size);

  for (let index = 0; index < 1600; index += 1) {
    const value = 180 + Math.random() * 50;
    context.fillStyle = `rgba(${value}, ${value}, ${value}, ${kind === "wall" ? 0.055 : 0.075})`;
    context.fillRect(Math.random() * size, Math.random() * size, Math.random() * 2.4, Math.random() * 2.4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(kind === "wall" ? 3.2 : 4.5, kind === "wall" ? 2.4 : 3);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

export default function Room() {
  const { scene, gl } = useThree();
  const { registerTarget } = useLight();
  const wallMaterialRef = useRef(null);
  const floorMaterialRef = useRef(null);
  const wallTexture = useMemo(() => makeSurfaceTexture("wall"), []);
  const floorTexture = useMemo(() => makeSurfaceTexture("floor"), []);

  useEffect(() => {
    scene.background = new THREE.Color("#111721");
    scene.fog = new THREE.Fog("#151c27", 4.6, 12.5);
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.outputColorSpace = THREE.SRGBColorSpace;

    registerTarget("scene", scene);
    registerTarget("renderer", gl);

    return () => {
      registerTarget("scene", null);
      registerTarget("renderer", null);
    };
  }, [gl, registerTarget, scene]);

  useEffect(() => {
    registerTarget("wallMaterial", wallMaterialRef.current);
    registerTarget("floorMaterial", floorMaterialRef.current);

    return () => {
      registerTarget("wallMaterial", null);
      registerTarget("floorMaterial", null);
    };
  }, [registerTarget]);

  return (
    <>
      <CameraRig />
      <Lighting />

      <group position={[0, 0, 0]}>
        <mesh receiveShadow position={[0, 1.72, -0.18]}>
          <boxGeometry args={[8.5, 3.8, 0.12]} />
          <meshStandardMaterial
            ref={wallMaterialRef}
            map={wallTexture}
            color="#3a4045"
            roughness={0.92}
            metalness={0}
          />
        </mesh>

        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 1.88]}>
          <planeGeometry args={[8.5, 4.9]} />
          <meshStandardMaterial
            ref={floorMaterialRef}
            map={floorTexture}
            color="#2b3034"
            roughness={0.94}
            metalness={0}
          />
        </mesh>

        <mesh receiveShadow position={[0, -0.15, -0.1]} rotation={[0, 0, 0]}>
          <boxGeometry args={[8.5, 0.1, 0.16]} />
          <meshStandardMaterial color="#24282b" roughness={0.95} />
        </mesh>

        <Lamp position={[-0.62, 1.52, -0.02]} />
        <LightSwitch position={[0.88, 1.18, 0.02]} />
      </group>

      <DustParticles />
      <ContactShadows
        position={[0, -0.185, 1.1]}
        opacity={0.24}
        scale={6}
        blur={2.7}
        far={3}
        resolution={512}
        frames={1}
      />
    </>
  );
}
