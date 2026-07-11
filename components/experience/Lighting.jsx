"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useLight } from "@/components/providers/LightProvider";

export default function Lighting() {
  const { scene } = useThree();
  const { registerTarget } = useLight();
  const ambientRef = useRef(null);
  const spotRef = useRef(null);
  const pointRef = useRef(null);
  const rectRef = useRef(null);
  const spotTargetRef = useRef(null);
  const environmentRef = useRef({ intensity: 0.18 });

  useEffect(() => {
    if (spotRef.current && spotTargetRef.current) {
      spotRef.current.target = spotTargetRef.current;
    }

    registerTarget("ambientLight", ambientRef.current);
    registerTarget("spotLight", spotRef.current);
    registerTarget("pointLight", pointRef.current);
    registerTarget("rectLight", rectRef.current);
    registerTarget("environment", environmentRef.current);

    return () => {
      registerTarget("ambientLight", null);
      registerTarget("spotLight", null);
      registerTarget("pointLight", null);
      registerTarget("rectLight", null);
      registerTarget("environment", null);
    };
  }, [registerTarget]);

  useFrame(() => {
    scene.environmentIntensity = environmentRef.current.intensity;
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.58} color="#aebad0" />
      <hemisphereLight intensity={0.34} color="#b6c2d8" groundColor="#141820" />
      <spotLight
        ref={spotRef}
        position={[-0.78, 1.46, 0.18]}
        angle={0.64}
        penumbra={0.82}
        distance={5}
        intensity={0}
        color="#ffc36f"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0008}
      />
      <object3D ref={spotTargetRef} position={[-0.34, 0.06, 1.92]} />
      <pointLight
        ref={pointRef}
        position={[-0.78, 1.55, 0.2]}
        intensity={0}
        distance={2.4}
        decay={2}
        color="#ffcf86"
      />
      <rectAreaLight
        ref={rectRef}
        position={[-0.66, 1.4, 0.18]}
        rotation={[-0.65, 0.15, 0.1]}
        width={0.8}
        height={0.45}
        intensity={0}
        color="#ffd59c"
      />
    </>
  );
}
