"use client";

import { ContactShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { useLight } from "@/components/providers/LightProvider";
import { getWallpaper } from "@/config/roomChoices";
import CameraRig from "./CameraRig";
import Chair from "./Chair";
import DustParticles from "./DustParticles";
import Lamp from "./Lamp";
import Lighting from "./Lighting";
import LightSwitch from "./LightSwitch";

function drawWallpaperPattern(context, size, option) {
  if (option.pattern === "vertical") {
    context.strokeStyle = option.line;
    context.lineWidth = 1;
    for (let x = 0; x <= size; x += 28) {
      context.beginPath();
      context.moveTo(x + 0.5, 0);
      context.lineTo(x + 0.5, size);
      context.stroke();
    }
    context.strokeStyle = option.accent;
    for (let x = 14; x <= size; x += 28) {
      context.beginPath();
      context.moveTo(x + 0.5, 0);
      context.lineTo(x + 0.5, size);
      context.stroke();
    }
  }

  if (option.pattern === "grid") {
    context.strokeStyle = option.line;
    context.lineWidth = 1;
    for (let line = 0; line <= size; line += 36) {
      context.beginPath();
      context.moveTo(line + 0.5, 0);
      context.lineTo(line + 0.5, size);
      context.moveTo(0, line + 0.5);
      context.lineTo(size, line + 0.5);
      context.stroke();
    }
  }

  if (option.pattern === "arc") {
    context.strokeStyle = option.line;
    context.lineWidth = 2;
    for (let y = 24; y < size; y += 64) {
      for (let x = 18; x < size; x += 58) {
        context.beginPath();
        context.arc(x, y, 12, Math.PI * 0.12, Math.PI * 0.88);
        context.arc(x + 28, y, 12, Math.PI * 0.12, Math.PI * 0.88);
        context.stroke();
      }
    }
  }
}

function drawLaminatePattern(context, size) {
  const plankHeight = 32;
  const plankColors = ["#3a2d23", "#443529", "#2f261f", "#4a392b"];

  for (let y = 0; y < size; y += plankHeight) {
    const offset = (y / plankHeight) % 2 === 0 ? 0 : 58;

    for (let x = -offset; x < size; x += 116) {
      const color = plankColors[Math.abs((x + y) / plankHeight) % plankColors.length | 0];
      context.fillStyle = color;
      context.fillRect(x, y, 116, plankHeight);

      context.strokeStyle = "rgba(10, 8, 6, 0.34)";
      context.lineWidth = 1;
      context.strokeRect(x + 0.5, y + 0.5, 115, plankHeight - 1);

      for (let grain = 0; grain < 5; grain += 1) {
        const grainY = y + 6 + grain * 5 + Math.random() * 2;
        context.strokeStyle = `rgba(210, 174, 128, ${0.055 + Math.random() * 0.035})`;
        context.beginPath();
        context.moveTo(x + 8, grainY);
        context.bezierCurveTo(x + 36, grainY + Math.random() * 4 - 2, x + 74, grainY + Math.random() * 4 - 2, x + 108, grainY);
        context.stroke();
      }
    }
  }
}

function makeSurfaceTexture(kind, wallpaperId = "plain") {
  const size = 256;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const wallpaper = getWallpaper(wallpaperId);
  canvas.width = size;
  canvas.height = size;

  context.fillStyle = kind === "wall" ? wallpaper.base : "#3a2d23";
  context.fillRect(0, 0, size, size);

  if (kind === "wall") drawWallpaperPattern(context, size, wallpaper);
  if (kind === "floor") drawLaminatePattern(context, size);

  for (let index = 0; index < 1600; index += 1) {
    const value = 180 + Math.random() * 50;
    context.fillStyle = `rgba(${value}, ${value}, ${value}, ${kind === "wall" ? 0.055 : 0.035})`;
    context.fillRect(Math.random() * size, Math.random() * size, Math.random() * 2.4, Math.random() * 2.4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(kind === "wall" ? 3.2 : 3.6, kind === "wall" ? 2.4 : 4.8);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

export default function Room() {
  const { scene, gl } = useThree();
  const { designStep, previewWallpaper, registerTarget, wallpaper } = useLight();
  const wallMaterialRef = useRef(null);
  const leftWallMaterialRef = useRef(null);
  const ceilingMaterialRef = useRef(null);
  const floorMaterialRef = useRef(null);
  const activeWallpaper = previewWallpaper || wallpaper;
  const wallTexture = useMemo(() => makeSurfaceTexture("wall", activeWallpaper), [activeWallpaper]);
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
    registerTarget("leftWallMaterial", leftWallMaterialRef.current);
    registerTarget("ceilingMaterial", ceilingMaterialRef.current);
    registerTarget("floorMaterial", floorMaterialRef.current);

    return () => {
      registerTarget("wallMaterial", null);
      registerTarget("leftWallMaterial", null);
      registerTarget("ceilingMaterial", null);
      registerTarget("floorMaterial", null);
    };
  }, [registerTarget]);

  useEffect(() => {
    if (!wallMaterialRef.current) return undefined;

    const material = wallMaterialRef.current;
    material.map = wallTexture;
    material.needsUpdate = true;
    material.opacity = 0.78;
    material.transparent = true;

    if (leftWallMaterialRef.current) {
      leftWallMaterialRef.current.map = wallTexture;
      leftWallMaterialRef.current.needsUpdate = true;
      leftWallMaterialRef.current.opacity = 0.78;
      leftWallMaterialRef.current.transparent = true;
    }

    gsap.to(material, {
      opacity: 1,
      duration: 0.45,
      ease: "power2.out"
    });
    if (leftWallMaterialRef.current) {
      gsap.to(leftWallMaterialRef.current, {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out"
      });
    }

    return () => {
      wallTexture.dispose();
    };
  }, [wallTexture]);

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

        <mesh receiveShadow position={[-4.19, 1.72, 1.92]}>
          <boxGeometry args={[0.12, 3.8, 4.9]} />
          <meshStandardMaterial
            ref={leftWallMaterialRef}
            map={wallTexture}
            color="#3a4045"
            roughness={0.92}
            metalness={0}
          />
        </mesh>

        <mesh receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 3.52, 1.9]}>
          <planeGeometry args={[8.5, 4.9]} />
          <meshStandardMaterial
            ref={ceilingMaterialRef}
            color="#08090a"
            roughness={0.96}
            metalness={0}
          />
        </mesh>

        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 1.88]}>
          <planeGeometry args={[8.5, 4.9]} />
          <meshStandardMaterial
            ref={floorMaterialRef}
            map={floorTexture}
            color="#2c2119"
            roughness={0.72}
            metalness={0}
          />
        </mesh>

        <mesh receiveShadow position={[0, -0.15, -0.1]} rotation={[0, 0, 0]}>
          <boxGeometry args={[8.5, 0.1, 0.16]} />
          <meshStandardMaterial color="#24282b" roughness={0.95} />
        </mesh>

        <mesh receiveShadow position={[-4.13, -0.15, 1.9]}>
          <boxGeometry args={[0.16, 0.1, 4.9]} />
          <meshStandardMaterial color="#24282b" roughness={0.95} />
        </mesh>

        <Lamp position={[-0.62, 1.52, -0.02]} />
        <LightSwitch position={[0.88, 1.18, 0.02]} />
        {designStep !== "idle" && <Chair />}
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
