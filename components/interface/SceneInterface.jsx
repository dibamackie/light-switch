"use client";

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
    wallpaper
  } = useLight();
  const message = getMessage(designStep);
  const messageColor = designStep === "idle" ? "text-white" : "text-[#25231f]";
  const eyebrow = designStep === "idle" ? "First light" : "Next decision";

  return (
    <>
      <div
        key={designStep}
        className={`pointer-events-none fixed left-6 top-[12dvh] z-20 max-w-[22rem] motion-safe:animate-message-rise sm:left-10 md:left-16 md:max-w-xl ${messageColor}`}
      >
        <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.34em] opacity-55">
          <span className="h-px w-8 bg-current" />
          {eyebrow}
        </p>
        <p className="text-balance text-3xl font-medium leading-[1.04] sm:text-5xl md:text-6xl">
          {message.heading}
        </p>
        {message.body && (
          <p className="mt-6 max-w-sm text-pretty text-base leading-7 opacity-68 sm:text-lg">
            {message.body}
          </p>
        )}
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
          Make the decision.
        </p>
      )}

      <AudioControl />
    </>
  );
}

function getMessage(step) {
  if (step === "wallpaper") {
    return {
      heading: "The light doesn't reveal the answer.",
      body: "It reveals where to begin."
    };
  }

  if (step === "chair") {
    return {
      heading: "Every choice gives the idea a little more character.",
      body: ""
    };
  }

  if (step === "chair-color") {
    return {
      heading: "Every choice gives the idea a little more character.",
      body: ""
    };
  }

  if (step === "final") {
    return {
      heading: "Great ideas aren't found.",
      body: "They're built. One decision at a time."
    };
  }

  return {
    heading: "Every beginning starts with a single decision.",
    body: ""
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
