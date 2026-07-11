"use client";

import { Html, useCursor } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useLight } from "@/components/providers/LightProvider";

export default function LightSwitch({ position }) {
  const { isLightOn, hasInteracted, isAnimating, toggleLight, registerTarget } = useLight();
  const [hovered, setHovered] = useState(false);
  const toggleRef = useRef(null);
  const instructionRef = useRef(null);

  useCursor(hovered);

  useEffect(() => {
    registerTarget("switchToggle", toggleRef.current);
    registerTarget("instruction", instructionRef.current);

    return () => {
      registerTarget("switchToggle", null);
      registerTarget("instruction", null);
    };
  }, [registerTarget]);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.58, 0.055]} />
        <meshStandardMaterial color={hovered ? "#e6e1d4" : "#d8d4c9"} roughness={0.72} metalness={0.02} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0, 0.04]}>
        <boxGeometry args={[0.2, 0.42, 0.03]} />
        <meshStandardMaterial color="#c7c2b8" roughness={0.78} />
      </mesh>

      <group ref={toggleRef} position={[0, isLightOn ? 0.07 : -0.07, 0.075]} rotation={[isLightOn ? -0.23 : 0.23, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.14, 0.24, 0.055]} />
          <meshStandardMaterial color={hovered ? "#f2eadc" : "#e0d9cc"} roughness={0.66} />
        </mesh>
      </group>

      <mesh
        position={[0, 0, 0.12]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={(event) => {
          event.stopPropagation();
          if (!isAnimating) toggleLight();
        }}
      >
        <boxGeometry args={[0.56, 0.78, 0.22]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html
        position={[0.44, -0.03, 0.06]}
        center
        distanceFactor={6.5}
        occlude={false}
        style={{ pointerEvents: "none" }}
      >
        <div
          ref={instructionRef}
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-slate-200/80 transition-opacity"
          style={{ opacity: hasInteracted ? 0 : 1 }}
        >
          Turn on the light.
        </div>
      </Html>
    </group>
  );
}
