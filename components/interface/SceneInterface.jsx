"use client";

import { useEffect, useRef } from "react";
import { useLight } from "@/components/providers/LightProvider";
import { chairColorOptions, wallpaperOptions } from "@/config/roomChoices";
import AudioControl from "./AudioControl";

function SwatchButton({ label, selected, swatchClassName = "", swatchStyle, onChoose, onPreview, onPreviewEnd }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onChoose}
      onFocus={onPreview}
      onBlur={onPreviewEnd}
      onMouseEnter={onPreview}
      onMouseLeave={onPreviewEnd}
      className="group grid gap-2 text-left text-[10px] uppercase text-current/55 transition hover:text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
    >
      <span
        className={`block h-11 w-11 rounded-sm border border-current/20 shadow-sm transition group-hover:scale-105 ${selected ? "ring-2 ring-current/50" : ""} ${swatchClassName}`}
        style={swatchStyle}
      />
      <span>{label}</span>
    </button>
  );
}

export default function SceneInterface() {
  const {
    chairColor,
    chooseChairColor,
    chooseWallpaper,
    designStep,
    isLightOn,
    hasInteracted,
    setPreviewChairColor,
    setPreviewWallpaper,
    toggleLight,
    wallpaper,
    registerTarget
  } = useLight();
  const statementRef = useRef(null);
  const message = getMessage(designStep);

  useEffect(() => {
    registerTarget("statement", statementRef.current);
    return () => registerTarget("statement", null);
  }, [registerTarget]);

  return (
    <>
      <div
        ref={statementRef}
        className="pointer-events-none fixed left-6 top-8 z-20 max-w-[18rem] translate-y-2 opacity-0 sm:left-10 sm:top-10 md:max-w-sm"
      >
        <p className="text-balance text-xl font-medium leading-tight text-current sm:text-2xl">{message.heading}</p>
        {message.body && <p className="mt-3 text-sm leading-relaxed text-current/70">{message.body}</p>}
      </div>

      {designStep === "wallpaper" && (
        <div className="fixed bottom-20 left-5 z-30 flex max-w-[calc(100vw-2.5rem)] gap-3 overflow-x-auto py-2 text-current sm:bottom-8 sm:left-10">
          {wallpaperOptions.map((option) => (
            <SwatchButton
              key={option.id}
              label={option.label}
              selected={wallpaper === option.id}
              onChoose={() => chooseWallpaper(option.id)}
              onPreview={() => setPreviewWallpaper(option.id)}
              onPreviewEnd={() => setPreviewWallpaper(null)}
              swatchStyle={{
                backgroundColor: option.base,
                backgroundImage: getWallpaperPreview(option)
              }}
            />
          ))}
        </div>
      )}

      {designStep === "chair-color" && (
        <div className="fixed bottom-20 left-5 z-30 flex max-w-[calc(100vw-2.5rem)] gap-3 overflow-x-auto py-2 text-current sm:bottom-8 sm:left-10">
          {chairColorOptions.map((option) => (
            <SwatchButton
              key={option.id}
              label={option.label}
              selected={chairColor === option.id}
              onChoose={() => chooseChairColor(option.id)}
              onPreview={() => setPreviewChairColor(option.id)}
              onPreviewEnd={() => setPreviewChairColor(null)}
              swatchStyle={{ backgroundColor: option.color }}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        aria-pressed={isLightOn}
        aria-label={isLightOn ? "Turn off the light" : "Turn on the light"}
        onClick={toggleLight}
        className="fixed left-5 bottom-5 z-30 rounded-sm border border-current/30 px-4 py-3 text-sm text-current opacity-0 transition focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
      >
        {isLightOn ? "Turn off the light" : "Turn on the light"}
      </button>

      {!hasInteracted && (
        <p className="pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-[0.22em] text-current/55 sm:hidden">
          Turn on the light.
        </p>
      )}

      <AudioControl />
    </>
  );
}

function getMessage(step) {
  if (step === "wallpaper") {
    return {
      heading: "Now shape the space.",
      body: "Choose a wallpaper."
    };
  }

  if (step === "chair") {
    return {
      heading: "Every space needs a place to begin.",
      body: ""
    };
  }

  if (step === "chair-color") {
    return {
      heading: "Choose how it feels.",
      body: ""
    };
  }

  if (step === "final") {
    return {
      heading: "An idea becomes clearer with every decision.",
      body: ""
    };
  }

  return {
    heading: "Light changes how we see a space.",
    body: "Switch it off. See it differently."
  };
}

function getWallpaperPreview(option) {
  if (option.pattern === "vertical") {
    return `repeating-linear-gradient(90deg, transparent 0 10px, ${option.line} 10px 11px, transparent 11px 22px)`;
  }

  if (option.pattern === "grid") {
    return `linear-gradient(${option.line} 1px, transparent 1px), linear-gradient(90deg, ${option.line} 1px, transparent 1px)`;
  }

  if (option.pattern === "arc") {
    return `radial-gradient(circle at 16px 18px, transparent 0 9px, ${option.line} 10px 11px, transparent 12px)`;
  }

  return `radial-gradient(circle, ${option.accent} 0 1px, transparent 1px)`;
}
