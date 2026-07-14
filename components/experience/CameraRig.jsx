"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLight } from "@/components/providers/LightProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CameraRig() {
  const { camera, gl, pointer, size } = useThree();
  const { designStep } = useLight();
  const reducedMotion = useReducedMotion();
  const basePosition = useRef(new THREE.Vector3(2.65, 1.48, 4.15));
  const homePosition = useRef(new THREE.Vector3(2.65, 1.48, 4.15));
  const target = useRef(new THREE.Vector3(-0.22, 1.18, 0.02));
  const homeTarget = useRef(new THREE.Vector3(-0.22, 1.18, 0.02));
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const desiredDragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    const mobile = size.width < 700;
    const landscape = size.width > size.height;

    if (mobile && !landscape) {
      basePosition.current.set(2.35, 1.55, 7.05);
      target.current.set(-0.58, 1.0, 0.36);
      camera.fov = 60;
    } else if (mobile && landscape) {
      basePosition.current.set(2.62, 1.24, 4.1);
      target.current.set(0.05, 1.13, 0.03);
      camera.fov = 42;
    } else {
      basePosition.current.set(2.65, 1.48, 4.15);
      target.current.set(-0.22, 1.18, 0.02);
      camera.fov = 38;
    }

    homePosition.current.copy(basePosition.current);
    homeTarget.current.copy(target.current);
    camera.position.copy(basePosition.current);
    camera.lookAt(target.current);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  useEffect(() => {
    const resetCamera = () => {
      desiredDragOffset.current = { x: 0, y: 0 };
      dragOffset.current = { x: 0, y: 0 };
      basePosition.current.copy(homePosition.current);
      target.current.copy(homeTarget.current);
      camera.position.copy(homePosition.current);
      camera.lookAt(homeTarget.current);
    };

    window.addEventListener("first-light-reset-camera", resetCamera);
    return () => window.removeEventListener("first-light-reset-camera", resetCamera);
  }, [camera]);

  useEffect(() => {
    const element = gl.domElement;

    const handlePointerDown = (event) => {
      dragging.current = true;
      dragStart.current = {
        x: event.clientX,
        y: event.clientY
      };
      element.setPointerCapture?.(event.pointerId);
      element.style.cursor = "grabbing";
    };

    const handlePointerMove = (event) => {
      if (!dragging.current) return;

      const deltaX = (event.clientX - dragStart.current.x) / Math.max(size.width, 1);
      const deltaY = (event.clientY - dragStart.current.y) / Math.max(size.height, 1);

      desiredDragOffset.current.x = THREE.MathUtils.clamp(desiredDragOffset.current.x - deltaX * 1.35, -0.95, 0.95);
      desiredDragOffset.current.y = THREE.MathUtils.clamp(desiredDragOffset.current.y + deltaY * 0.85, -0.38, 0.42);
      dragStart.current = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handlePointerUp = (event) => {
      dragging.current = false;
      element.releasePointerCapture?.(event.pointerId);
      element.style.cursor = "grab";
    };

    element.style.cursor = "grab";
    element.style.touchAction = "none";
    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerUp);
    element.addEventListener("pointerleave", handlePointerUp);

    return () => {
      element.style.cursor = "";
      element.style.touchAction = "";
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerUp);
      element.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [gl, size.height, size.width]);

  useFrame(({ clock }) => {
    const finalView = designStep === "final";
    if (finalView) {
      const mobile = size.width < 700;
      const finalPosition = mobile
        ? new THREE.Vector3(2.15, 1.65, 7.35)
        : new THREE.Vector3(2.95, 1.78, 5.35);
      const finalTarget = mobile
        ? new THREE.Vector3(-0.9, 0.95, 0.72)
        : new THREE.Vector3(-0.95, 0.95, 0.75);

      basePosition.current.lerp(finalPosition, 0.025);
      target.current.lerp(finalTarget, 0.025);
      desiredDragOffset.current.x = THREE.MathUtils.lerp(desiredDragOffset.current.x, 0, 0.035);
      desiredDragOffset.current.y = THREE.MathUtils.lerp(desiredDragOffset.current.y, 0, 0.035);
    }

    dragOffset.current.x = THREE.MathUtils.lerp(dragOffset.current.x, desiredDragOffset.current.x, 0.08);
    dragOffset.current.y = THREE.MathUtils.lerp(dragOffset.current.y, desiredDragOffset.current.y, 0.08);

    if (reducedMotion) {
      const lookTarget = target.current.clone();
      lookTarget.x += dragOffset.current.x;
      lookTarget.y += dragOffset.current.y;
      camera.lookAt(lookTarget);
      return;
    }

    const time = clock.getElapsedTime();
    const nextX = basePosition.current.x + dragOffset.current.x * 0.2 + pointer.x * 0.055 + Math.sin(time * 0.32) * 0.012;
    const nextY = basePosition.current.y + dragOffset.current.y * 0.16 + pointer.y * 0.035 + Math.sin(time * 0.41) * 0.009;
    const nextZ = basePosition.current.z + Math.cos(time * 0.27) * 0.012;
    const lookTarget = target.current.clone();
    lookTarget.x += dragOffset.current.x;
    lookTarget.y += dragOffset.current.y;

    camera.position.lerp({ x: nextX, y: nextY, z: nextZ }, 0.045);
    camera.lookAt(lookTarget);
  });

  return null;
}
