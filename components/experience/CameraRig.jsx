"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CameraRig() {
  const { camera, pointer, size } = useThree();
  const reducedMotion = useReducedMotion();
  const basePosition = useRef(new THREE.Vector3(2.65, 1.48, 4.15));
  const target = useRef(new THREE.Vector3(-0.22, 1.18, 0.02));

  useEffect(() => {
    const mobile = size.width < 700;
    const landscape = size.width > size.height;

    if (mobile && !landscape) {
      basePosition.current.set(2.12, 1.42, 6.25);
      target.current.set(-0.18, 1.05, 0.18);
      camera.fov = 56;
    } else if (mobile && landscape) {
      basePosition.current.set(2.62, 1.24, 4.1);
      target.current.set(0.05, 1.13, 0.03);
      camera.fov = 42;
    } else {
      basePosition.current.set(2.65, 1.48, 4.15);
      target.current.set(-0.22, 1.18, 0.02);
      camera.fov = 38;
    }

    camera.position.copy(basePosition.current);
    camera.lookAt(target.current);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  useFrame(({ clock }) => {
    if (reducedMotion) return;

    const time = clock.getElapsedTime();
    const nextX = basePosition.current.x + pointer.x * 0.055 + Math.sin(time * 0.32) * 0.012;
    const nextY = basePosition.current.y + pointer.y * 0.035 + Math.sin(time * 0.41) * 0.009;
    const nextZ = basePosition.current.z + Math.cos(time * 0.27) * 0.012;

    camera.position.lerp({ x: nextX, y: nextY, z: nextZ }, 0.045);
    camera.lookAt(target.current);
  });

  return null;
}
