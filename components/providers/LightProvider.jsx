"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useSound } from "@/hooks/useSound";

export const LightContext = createContext(null);

const DARK_THEME = {
  pageBg: "#111721",
  pageFg: "#e9edf0",
  background: "#111721",
  fog: "#151c27",
  wall: "#3a4045",
  ceiling: "#08090a",
  floor: "#15100c",
  exposure: 0.84,
  ambient: 0.58,
  environment: 0.18,
  lamp: 0,
  point: 0,
  spot: 0,
  rect: 0,
  emissive: 0,
  instructionOpacity: 1,
  hazeOpacity: 0.2
};

const LIGHT_THEME = {
  pageBg: "#ece8dc",
  pageFg: "#25231f",
  background: "#e5dfd1",
  fog: "#d9d0bf",
  wall: "#e5dfd3",
  ceiling: "#08090a",
  floor: "#2c2119",
  exposure: 1.04,
  ambient: 1.15,
  environment: 0.75,
  lamp: 8.2,
  point: 1.8,
  spot: 45,
  rect: 3.4,
  emissive: 2.6,
  instructionOpacity: 0,
  hazeOpacity: 0.08
};

export function LightProvider({ children }) {
  const [isLightOn, setIsLightOn] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [designStep, setDesignStep] = useState("idle");
  const [wallpaper, setWallpaper] = useState("plain");
  const [previewWallpaper, setPreviewWallpaper] = useState(null);
  const [chairColor, setChairColor] = useState("cream");
  const [previewChairColor, setPreviewChairColor] = useState(null);
  const [endingPhase, setEndingPhase] = useState(0);
  const targetsRef = useRef({});
  const timelineRef = useRef(null);
  const mountedRef = useRef(false);
  const { muted, setMuted, playClick, startHum, stopHum } = useSound();

  const applyInstantState = useCallback((on) => {
    const theme = on ? LIGHT_THEME : DARK_THEME;
    const targets = targetsRef.current;

    document.documentElement.style.setProperty("--page-bg", theme.pageBg);
    document.documentElement.style.setProperty("--page-fg", theme.pageFg);
    document.body.classList.toggle("first-light-on", on);

    if (targets.scene) {
      targets.scene.background.set(theme.background);
      targets.scene.fog.color.set(theme.fog);
    }
    if (targets.wallMaterial) targets.wallMaterial.color.set(theme.wall);
    if (targets.leftWallMaterial) targets.leftWallMaterial.color.set(theme.wall);
    if (targets.ceilingMaterial) targets.ceilingMaterial.color.set(theme.ceiling);
    if (targets.floorMaterial) targets.floorMaterial.color.set(theme.floor);
    if (targets.ambientLight) targets.ambientLight.intensity = theme.ambient;
    if (targets.environment) targets.environment.intensity = theme.environment;
    if (targets.spotLight) targets.spotLight.intensity = theme.spot;
    if (targets.pointLight) targets.pointLight.intensity = theme.point;
    if (targets.rectLight) targets.rectLight.intensity = theme.rect;
    if (targets.emissiveMaterial) targets.emissiveMaterial.emissiveIntensity = theme.emissive;
    if (targets.renderer) targets.renderer.toneMappingExposure = theme.exposure;
    if (targets.instruction) targets.instruction.style.opacity = theme.instructionOpacity;
    if (targets.haze) targets.haze.material.opacity = theme.hazeOpacity;
  }, []);

  const animateTo = useCallback((on, options = {}) => {
    const targets = targetsRef.current;
    const theme = on ? LIGHT_THEME : DARK_THEME;
    const preserveScene = options.preserveScene ?? false;

    timelineRef.current?.kill();
    setIsAnimating(true);

    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        setIsAnimating(false);
        if (on) {
          startHum();
          setDesignStep((current) => current === "idle" ? "wallpaper" : current);
        } else if (!preserveScene) {
          setDesignStep("idle");
          setPreviewWallpaper(null);
          setPreviewChairColor(null);
        }
      },
      onReverseComplete: () => setIsAnimating(false)
    });

    timeline.call(playClick, [], 0);

    if (targets.switchToggle) {
      timeline.to(
        targets.switchToggle.rotation,
        { x: on ? -0.23 : 0.23, duration: 0.2, ease: "power3.inOut" },
        0
      );
      timeline.to(
        targets.switchToggle.position,
        { y: on ? 0.07 : -0.07, duration: 0.2, ease: "power3.inOut" },
        0
      );
    }

    if (!on) timeline.call(stopHum, [], 0.05);

    timeline.to({}, { duration: 0.11 });
    timeline.call(() => {
      document.body.classList.toggle("first-light-on", on);
    });

    if (targets.emissiveMaterial) {
      timeline.to(targets.emissiveMaterial, { emissiveIntensity: theme.emissive, duration: 0.65 }, 0.22);
    }
    if (targets.spotLight) timeline.to(targets.spotLight, { intensity: theme.spot, duration: 1.0 }, 0.24);
    if (targets.pointLight) timeline.to(targets.pointLight, { intensity: theme.point, duration: 0.8 }, 0.24);
    if (targets.rectLight) timeline.to(targets.rectLight, { intensity: theme.rect, duration: 0.9 }, 0.26);
    if (targets.ambientLight) timeline.to(targets.ambientLight, { intensity: theme.ambient, duration: 1.0 }, 0.24);
    if (targets.environment) timeline.to(targets.environment, { intensity: theme.environment, duration: 1.0 }, 0.24);
    if (targets.renderer) timeline.to(targets.renderer, { toneMappingExposure: theme.exposure, duration: 1.1 }, 0.24);

    if (targets.scene) {
      timeline.to(targets.scene.background, { r: theme.background === LIGHT_THEME.background ? 0.898 : 0.067, g: theme.background === LIGHT_THEME.background ? 0.875 : 0.09, b: theme.background === LIGHT_THEME.background ? 0.82 : 0.129, duration: 1.1 }, 0.24);
      timeline.to(targets.scene.fog.color, { r: theme.fog === LIGHT_THEME.fog ? 0.851 : 0.082, g: theme.fog === LIGHT_THEME.fog ? 0.816 : 0.11, b: theme.fog === LIGHT_THEME.fog ? 0.749 : 0.153, duration: 1.1 }, 0.24);
    }

    if (targets.wallMaterial) timeline.to(targets.wallMaterial.color, { r: on ? 0.898 : 0.227, g: on ? 0.875 : 0.251, b: on ? 0.827 : 0.271, duration: 1.1 }, 0.24);
    if (targets.leftWallMaterial) timeline.to(targets.leftWallMaterial.color, { r: on ? 0.898 : 0.227, g: on ? 0.875 : 0.251, b: on ? 0.827 : 0.271, duration: 1.1 }, 0.24);
    if (targets.ceilingMaterial) timeline.to(targets.ceilingMaterial.color, { r: 0.031, g: 0.035, b: 0.039, duration: 1.1 }, 0.24);
    if (targets.floorMaterial) timeline.to(targets.floorMaterial.color, { r: on ? 0.173 : 0.082, g: on ? 0.129 : 0.063, b: on ? 0.098 : 0.047, duration: 1.1 }, 0.24);
    if (targets.haze) timeline.to(targets.haze.material, { opacity: theme.hazeOpacity, duration: 1.0 }, 0.24);

    timeline.to(document.documentElement, { "--page-bg": theme.pageBg, "--page-fg": theme.pageFg, duration: 1.0 }, 0.24);
    if (targets.instruction) timeline.to(targets.instruction, { opacity: hasInteracted || on ? 0 : 1, duration: 0.45 }, 0.05);
    timelineRef.current = timeline;
  }, [hasInteracted, playClick, startHum, stopHum]);

  const setLight = useCallback((next, options = {}) => {
    const resolved = typeof next === "function" ? next(isLightOn) : next;

    setIsLightOn(resolved);
    if (options.interaction) {
      setHasInteracted(true);
      localStorage.setItem("first-light-has-interacted", "true");
      animateTo(resolved, options);
    }
  }, [animateTo, isLightOn]);

  const toggleLight = useCallback(() => {
    if (isAnimating) return;
    setLight(!isLightOn, { interaction: true, preserveScene: isLightOn });
  }, [isAnimating, isLightOn, setLight]);

  const chooseWallpaper = useCallback((nextWallpaper) => {
    setWallpaper(nextWallpaper);
    setPreviewWallpaper(null);
    setDesignStep("chair");
  }, []);

  const markChairSettled = useCallback(() => {
    setDesignStep((current) => current === "chair" ? "chair-color" : current);
  }, []);

  const chooseChairColor = useCallback((nextColor) => {
    setChairColor(nextColor);
    setPreviewChairColor(null);
    setDesignStep("final");
    setEndingPhase(0);
  }, []);

  const resetExperience = useCallback(() => {
    timelineRef.current?.kill();
    stopHum();
    setWallpaper("plain");
    setPreviewWallpaper(null);
    setChairColor("cream");
    setPreviewChairColor(null);
    setEndingPhase(0);
    setIsLightOn(false);
    setHasInteracted(false);
    setDesignStep("idle");
    applyInstantState(false);
    window.requestAnimationFrame(() => window.dispatchEvent(new Event("first-light-reset-camera")));
  }, [applyInstantState, stopHum]);

  const turnOffLight = useCallback(() => {
    if (isAnimating || !isLightOn) return;
    setLight(false, { interaction: true, preserveScene: true });
  }, [isAnimating, isLightOn, setLight]);

  const registerTarget = useCallback((name, target) => {
    if (target) {
      targetsRef.current[name] = target;
      applyInstantState(isLightOn);
      return;
    }

    delete targetsRef.current[name];
  }, [applyInstantState, isLightOn]);

  useEffect(() => {
    mountedRef.current = true;
    localStorage.removeItem("first-light-state");
    setIsLightOn(false);
    setHasInteracted(false);
    setDesignStep("idle");
    setEndingPhase(0);
    applyInstantState(false);
  }, [applyInstantState]);

  useEffect(() => {
    if (designStep !== "final") {
      setEndingPhase(0);
      return undefined;
    }

    const timers = [
      window.setTimeout(() => setEndingPhase(1), 1300),
      window.setTimeout(() => setEndingPhase(2), 3600),
      window.setTimeout(() => setEndingPhase(3), 5600)
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [designStep]);

  useEffect(() => {
    const targets = targetsRef.current;
    if (!targets.spotLight || !targets.pointLight || !targets.rectLight || !targets.renderer) return undefined;

    if (designStep !== "final") return undefined;

    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    timeline.to(targets.spotLight, { intensity: 55, duration: 1.8 }, 0);
    timeline.to(targets.pointLight, { intensity: 2.25, duration: 1.8 }, 0);
    timeline.to(targets.rectLight, { intensity: 4.2, duration: 1.8 }, 0);
    timeline.to(targets.renderer, { toneMappingExposure: 1.12, duration: 1.8 }, 0);

    return () => timeline.kill();
  }, [designStep]);

  useEffect(() => {
    if (!mountedRef.current) return;
    applyInstantState(isLightOn);
  }, [applyInstantState, isLightOn]);

  const value = useMemo(() => ({
    isLightOn,
    hasInteracted,
    isAnimating,
    designStep,
    wallpaper,
    previewWallpaper,
    chairColor,
    previewChairColor,
    endingPhase,
    muted,
    setMuted,
    setPreviewWallpaper,
    setPreviewChairColor,
    chooseWallpaper,
    chooseChairColor,
    markChairSettled,
    resetExperience,
    setLight,
    turnOffLight,
    toggleLight,
    registerTarget
  }), [
    chairColor,
    chooseChairColor,
    chooseWallpaper,
    designStep,
    hasInteracted,
    endingPhase,
    isAnimating,
    isLightOn,
    markChairSettled,
    muted,
    previewChairColor,
    previewWallpaper,
    setLight,
    setMuted,
    resetExperience,
    turnOffLight,
    toggleLight,
    wallpaper,
    registerTarget
  ]);

  return <LightContext.Provider value={value}>{children}</LightContext.Provider>;
}

export function useLight() {
  const context = useContext(LightContext);
  if (!context) {
    throw new Error("useLight must be used inside LightProvider");
  }

  return context;
}
