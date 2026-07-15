"use client";

import { Component, Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import LoadingScreen from "@/components/interface/LoadingScreen";
import { LightContext, useLight } from "@/components/providers/LightProvider";
import Room from "./Room";

const LAMP_MODEL = "/models/AnisotropyBarnLamp.glb";
const CHAIR_MODEL = "https://threejs.org/examples/models/gltf/SheenChair.glb";
const ARTWORK_TEXTURE = "https://threejs.org/examples/textures/758px-Canestra_di_frutta_(Caravaggio).jpg";

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Required scene asset failed to load", error);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

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

function RequiredAssetGate({ onReady }) {
  useGLTF(LAMP_MODEL);
  useGLTF(CHAIR_MODEL);
  useTexture(ARTWORK_TEXTURE);

  useEffect(() => {
    onReady();
  }, [onReady]);

  return null;
}

export default function ExperienceCanvas() {
  const lightContext = useLight();
  const [webglReady, setWebglReady] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [loaderDismissed, setLoaderDismissed] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return [1, 1.5];
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    return [1, mobile ? 1.35 : 1.75];
  }, []);

  useEffect(() => {
    setWebglReady(supportsWebGL());
  }, []);

  useEffect(() => {
    if (!canvasReady || !sceneReady || loadFailed) return undefined;

    const hold = window.setTimeout(() => {
      setLoaderDismissed(true);
    }, 500);

    return () => window.clearTimeout(hold);
  }, [canvasReady, loadFailed, sceneReady]);

  const handleRetry = () => {
    useGLTF.clear?.(LAMP_MODEL);
    useGLTF.clear?.(CHAIR_MODEL);
    useTexture.clear?.(ARTWORK_TEXTURE);
    setCanvasReady(false);
    setSceneReady(false);
    setLoaderDismissed(false);
    setLoadFailed(false);
    setRetryKey((key) => key + 1);
  };

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
        key={retryKey}
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
        className={`transition-opacity duration-[1200ms] ease-out ${
          loaderDismissed ? "opacity-100" : "opacity-0"
        }`}
      >
        <SceneErrorBoundary key={retryKey} onError={() => setLoadFailed(true)}>
          <Suspense fallback={null}>
            <RequiredAssetGate onReady={() => setSceneReady(true)} />
            <LightContext.Provider value={lightContext}>
              <Room />
            </LightContext.Provider>
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>
      <div
        className={`absolute inset-0 z-50 transition-opacity duration-[900ms] ease-out ${
          loaderDismissed && !loadFailed ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
        }`}
        aria-hidden={loaderDismissed && !loadFailed}
      >
        <LoadingScreen failed={loadFailed} onRetry={handleRetry} />
      </div>
    </div>
  );
}
