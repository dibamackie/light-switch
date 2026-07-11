"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import LoadingScreen from "@/components/interface/LoadingScreen";
import Room from "./Room";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function ExperienceCanvas() {
  const [webglReady, setWebglReady] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return [1, 1.5];
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    return [1, mobile ? 1.35 : 1.75];
  }, []);

  useEffect(() => {
    setWebglReady(supportsWebGL());
  }, []);

  if (!webglReady) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#111721] px-6 text-center text-slate-200">
        <div>
          <p className="text-lg">First Light needs WebGL to render the room.</p>
          <p className="mt-2 text-sm text-slate-400">The accessible light control is still available by keyboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={dpr}
        onCreated={() => setCanvasReady(true)}
        camera={{ position: [2.65, 1.48, 4.15], fov: 38, near: 0.1, far: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.72
        }}
      >
        <Suspense fallback={null}>
          <Room />
        </Suspense>
      </Canvas>
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${canvasReady ? "opacity-0" : "opacity-100"}`}>
        <LoadingScreen />
      </div>
    </div>
  );
}
