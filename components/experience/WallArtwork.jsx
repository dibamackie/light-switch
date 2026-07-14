"use client";

import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { useLight } from "@/components/providers/LightProvider";
import { useIsMobile } from "@/hooks/useIsMobile";

const ARTWORK_TEXTURE = "https://threejs.org/examples/textures/758px-Canestra_di_frutta_(Caravaggio).jpg";
const ARTWORK_ASPECT = 748 / 600;
const LEFT_WALL_FRONT_X = -4.085;
const MATERIAL_OPACITIES = [0.07, 1, 1, 1, 1, 1, 1];

export default function WallArtwork() {
  const { gl } = useThree();
  const { designStep } = useLight();
  const isMobile = useIsMobile();
  const texture = useTexture(ARTWORK_TEXTURE);
  const groupRef = useRef(null);
  const materialRefs = useRef([]);

  const width = isMobile ? 0.86 : 1.12;
  const height = width / ARTWORK_ASPECT;
  const frameThickness = isMobile ? 0.045 : 0.055;
  const finalPosition = useMemo(() => (isMobile ? [LEFT_WALL_FRONT_X, 1.52, 1.72] : [LEFT_WALL_FRONT_X, 1.65, 2.1]), [isMobile]);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
  }, [gl, texture]);

  useEffect(() => {
    materialRefs.current.forEach((material, index) => {
      if (!material) return;
      material.transparent = true;
      material.opacity = designStep === "chair" ? 0 : MATERIAL_OPACITIES[index];
      material.depthWrite = material.opacity >= 1;
    });
  }, [designStep]);

  useEffect(() => {
    if (!groupRef.current || designStep !== "chair") {
      if (groupRef.current) {
        groupRef.current.position.set(...finalPosition);
        groupRef.current.rotation.set(0, Math.PI / 2, 0);
        groupRef.current.scale.setScalar(1);
      }
      return undefined;
    }

    const group = groupRef.current;
    group.position.set(finalPosition[0] + 0.08, finalPosition[1] - 0.28, finalPosition[2]);
    group.rotation.set(0.012, Math.PI / 2 - 0.018, -0.035);
    group.scale.setScalar(0.94);

    materialRefs.current.forEach((material) => {
      if (!material) return;
      material.transparent = true;
      material.opacity = 0;
      material.depthWrite = false;
    });

    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
    timeline.to(group.position, { x: finalPosition[0], y: finalPosition[1], duration: 1.05 }, 0);
    timeline.to(group.rotation, { x: 0, y: Math.PI / 2, z: 0, duration: 1.05 }, 0);
    timeline.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.85 }, 0.06);
    materialRefs.current.forEach((material, index) => {
      if (!material) return;
      timeline.to(material, { opacity: MATERIAL_OPACITIES[index], duration: 0.7, ease: "sine.out" }, 0.14);
    });
    timeline.call(() => {
      materialRefs.current.forEach((material, index) => {
        if (!material) return;
        material.depthWrite = MATERIAL_OPACITIES[index] >= 1;
      });
    });

    return () => timeline.kill();
  }, [designStep, finalPosition]);

  if (designStep === "idle" || designStep === "wallpaper") return null;

  return (
    <group ref={groupRef} position={finalPosition} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0.018, -0.022, -0.026]}>
        <planeGeometry args={[width + frameThickness * 3.6, height + frameThickness * 3.6]} />
        <meshBasicMaterial
          ref={(material) => { materialRefs.current[0] = material; }}
          color="#050505"
          opacity={0.07}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0, -0.012]}>
        <boxGeometry args={[width + frameThickness * 3, height + frameThickness * 3, 0.045]} />
        <meshStandardMaterial
          ref={(material) => { materialRefs.current[1] = material; }}
          color="#191411"
          roughness={0.82}
          metalness={0}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0, 0.025]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          ref={(material) => { materialRefs.current[2] = material; }}
          map={texture}
          color="#ffffff"
          roughness={0.56}
          metalness={0}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, height / 2 + frameThickness / 2, 0.028]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, 0.06]} />
        <meshStandardMaterial
          ref={(material) => { materialRefs.current[3] = material; }}
          color="#211915"
          roughness={0.64}
          metalness={0.05}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, -height / 2 - frameThickness / 2, 0.028]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, 0.06]} />
        <meshStandardMaterial
          ref={(material) => { materialRefs.current[4] = material; }}
          color="#211915"
          roughness={0.64}
          metalness={0.05}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[-width / 2 - frameThickness / 2, 0, 0.028]}>
        <boxGeometry args={[frameThickness, height + frameThickness * 2, 0.06]} />
        <meshStandardMaterial
          ref={(material) => { materialRefs.current[5] = material; }}
          color="#211915"
          roughness={0.64}
          metalness={0.05}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[width / 2 + frameThickness / 2, 0, 0.028]}>
        <boxGeometry args={[frameThickness, height + frameThickness * 2, 0.06]} />
        <meshStandardMaterial
          ref={(material) => { materialRefs.current[6] = material; }}
          color="#211915"
          roughness={0.64}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

useTexture.preload(ARTWORK_TEXTURE);
