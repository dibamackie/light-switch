"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { useLight } from "@/components/providers/LightProvider";
import { getChairColor } from "@/config/roomChoices";

const CHAIR_MODEL = "https://threejs.org/examples/models/gltf/SheenChair.glb";
const FLOOR_Y = -0.2;
const CHAIR_SCALE = 2.1;

export default function Chair() {
  const { chairColor, designStep, markChairSettled, previewChairColor } = useLight();
  const { scene } = useGLTF(CHAIR_MODEL);
  const groupRef = useRef(null);
  const settleTimerRef = useRef(null);
  const activeColor = getChairColor(previewChairColor || chairColor).color;

  const { chairScene, fabricMaterial, settledY } = useMemo(() => {
    const clone = scene.clone(true);
    let nextFabricMaterial = null;

    clone.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.material) {
        object.material = object.material.clone();
      }

      if (object.name === "SheenChair_fabric" || object.material?.name?.toLowerCase().includes("fabric")) {
        nextFabricMaterial = object.material;
      }
    });

    const bounds = new THREE.Box3().setFromObject(clone);

    return {
      chairScene: clone,
      fabricMaterial: nextFabricMaterial,
      settledY: FLOOR_Y - bounds.min.y * CHAIR_SCALE
    };
  }, [scene]);

  useEffect(() => {
    if (!groupRef.current || designStep !== "chair") return undefined;

    const group = groupRef.current;
    group.visible = true;
    group.position.set(-1.72, settledY + 0.9, 1.28);
    group.rotation.set(0, 0.18, 0);
    group.scale.setScalar(0.001);

    const timeline = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        settleTimerRef.current = window.setTimeout(markChairSettled, 1200);
      }
    });

    timeline.to(group.scale, { x: CHAIR_SCALE, y: CHAIR_SCALE, z: CHAIR_SCALE, duration: 0.65 }, 0);
    timeline.to(group.position, { x: -1.58, y: settledY, z: 1.18, duration: 0.95 }, 0.05);
    timeline.to(group.rotation, { y: 0.28, duration: 0.95 }, 0.05);

    return () => {
      timeline.kill();
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    };
  }, [designStep, markChairSettled, settledY]);

  useEffect(() => {
    const material = fabricMaterial;
    if (!material?.color) return undefined;

    const color = new THREE.Color(activeColor);
    const tween = gsap.to(material.color, {
      r: color.r,
      g: color.g,
      b: color.b,
      duration: 0.35,
      ease: "power2.out"
    });

    return () => tween.kill();
  }, [activeColor, fabricMaterial]);

  if (designStep === "idle" || designStep === "wallpaper") return null;

  return (
    <group ref={groupRef} position={[-1.72, settledY + 0.9, 1.28]} rotation={[0, 0.18, 0]} scale={0.001}>
      <primitive object={chairScene} />
    </group>
  );
}

useGLTF.preload(CHAIR_MODEL);
