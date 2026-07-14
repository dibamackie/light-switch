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
        className={`block h-10 w-10 rounded-sm border border-current/20 shadow-sm transition group-hover:scale-105 sm:h-11 sm:w-11 ${selected ? "ring-2 ring-current/50" : ""} ${swatchClassName}`}
        style={swatchStyle}
      />
      <span>{label}</span>
    </button>
  );
}

function WallpaperChoiceButton({ label, selected, swatchStyle, onChoose, onPreview, onPreviewEnd }) {
  return (
    <button
      type="button"
      aria-label={`Choose ${label} wallpaper`}
      aria-pressed={selected}
      onClick={onChoose}
      onFocus={onPreview}
      onBlur={onPreviewEnd}
      onMouseEnter={onPreview}
      onMouseLeave={onPreviewEnd}
      className={`flex w-full items-center gap-3 rounded-sm border px-3 py-3 text-left transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 ${
        selected ? "border-current/55 bg-black/5" : "border-current/15"
      }`}
    >
      <span className="block h-12 w-12 shrink-0 rounded-sm border border-current/20 shadow-sm" style={swatchStyle} />
      <span className="grid gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-current">{label}</span>
        <span className="text-xs text-current/50">Preview on hover</span>
      </span>
    </button>
  );
}

function ColorChoiceButton({ label, selected, swatchStyle, onChoose, onPreview, onPreviewEnd }) {
  return (
    <button
      type="button"
      aria-label={`Choose ${label} chair color`}
      aria-pressed={selected}
      onClick={onChoose}
      onFocus={onPreview}
      onBlur={onPreviewEnd}
      onMouseEnter={onPreview}
      onMouseLeave={onPreviewEnd}
      className={`flex w-full items-center gap-3 rounded-sm border px-3 py-3 text-left transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 ${
        selected ? "border-current/55 bg-black/5" : "border-current/15"
      }`}
    >
      <span className="block h-12 w-12 shrink-0 rounded-full border border-current/20 shadow-sm" style={swatchStyle} />
      <span className="grid gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-current">{label}</span>
        <span className="text-xs text-current/50">Preview on hover</span>
      </span>
    </button>
  );
}

export default function SceneInterface() {
  const {
    chairColor,
    chooseChairColor,
    chooseWallpaper,
    designStep,
    endingPhase,
    isLightOn,
    hasInteracted,
    resetExperience,
    setPreviewChairColor,
    setPreviewWallpaper,
    toggleLight,
    turnOffLight,
    wallpaper
  } = useLight();
  const message = getMessage(designStep);
  const messageColor = designStep === "idle" ? "text-white" : "text-[#25231f]";
  const eyebrow = designStep === "idle" ? "First light" : "Next decision";
  const showStageMessage = designStep !== "final";

  return (
    <>
      {showStageMessage && (
        <div
          key={designStep}
          className={`pointer-events-none fixed left-5 right-5 top-[8dvh] z-20 max-w-[19rem] motion-safe:animate-message-rise sm:left-10 sm:right-auto sm:top-[12dvh] sm:max-w-[22rem] md:left-16 md:max-w-xl ${messageColor}`}
        >
          <p className="mb-3 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] opacity-55 sm:mb-5 sm:text-[10px] sm:tracking-[0.34em]">
            <span className="h-px w-6 bg-current sm:w-8" />
            {eyebrow}
          </p>
          <p className="text-balance text-2xl font-medium leading-[1.06] sm:text-5xl md:text-6xl">
            {message.heading}
          </p>
          {message.body && (
            <p className="mt-4 max-w-[17rem] text-pretty text-sm leading-6 opacity-68 sm:mt-6 sm:max-w-sm sm:text-lg sm:leading-7">
              {message.body}
            </p>
          )}
        </div>
      )}

      {designStep === "final" && (
        <>
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[54dvh] bg-gradient-to-t from-[#08090a]/82 via-[#08090a]/42 to-transparent" />
        <section className="pointer-events-none fixed inset-x-5 bottom-[8dvh] z-30 mx-auto max-w-3xl text-center text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.65)] sm:bottom-[10dvh]">
          <div className={`transition duration-[1600ms] ${endingPhase >= 1 ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-sm"}`}>
            <p className="text-balance text-3xl font-medium leading-tight sm:text-5xl">
              Great ideas aren&apos;t found.
            </p>
            <p className="mt-2 text-balance text-3xl font-medium leading-tight sm:text-5xl">
              They&apos;re built - one decision at a time.
            </p>
          </div>

          <p className={`mt-7 text-sm uppercase tracking-[0.3em] text-white/72 transition duration-[1400ms] ${endingPhase >= 2 ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-sm"}`}>
            This space began in darkness.
          </p>

          <div className={`mt-9 transition duration-[1500ms] ${endingPhase >= 3 ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-sm"}`}>
            <h1 className="text-balance text-4xl font-medium leading-none sm:text-7xl">Where Ideas Begin</h1>
            <div className="pointer-events-auto mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetExperience}
                className="rounded-sm border border-white/35 px-5 py-3 text-sm text-white/82 transition hover:border-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
              >
                Experience it again
              </button>
              <button
                type="button"
                onClick={turnOffLight}
                className="rounded-sm border border-white/25 px-5 py-3 text-sm text-white/72 transition hover:border-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
              >
                Turn off the light
              </button>
            </div>
          </div>
        </section>
        </>
      )}

      {designStep === "wallpaper" && (
        <>
          <div className="fixed bottom-20 left-4 z-30 flex max-w-[calc(100vw-2rem)] gap-3 overflow-x-auto py-2 text-current sm:hidden">
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

          <aside className="fixed right-8 top-1/2 z-30 hidden w-64 -translate-y-1/2 text-[#25231f] motion-safe:animate-message-rise sm:block">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-current/50">Wall treatment</p>
              <p className="mt-2 text-lg font-medium leading-tight text-current">Choose a wallpaper</p>
            </div>
            <div className="grid gap-3">
              {wallpaperOptions.map((option) => (
                <WallpaperChoiceButton
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
          </aside>
        </>
      )}

      {designStep === "chair-color" && (
        <>
          <div className="fixed bottom-20 left-4 z-30 flex max-w-[calc(100vw-2rem)] gap-3 overflow-x-auto py-2 text-current sm:hidden">
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

          <aside className="fixed right-8 top-1/2 z-30 hidden w-64 -translate-y-1/2 text-[#25231f] motion-safe:animate-message-rise sm:block">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-current/50">Chair finish</p>
              <p className="mt-2 text-lg font-medium leading-tight text-current">Choose a color</p>
            </div>
            <div className="grid gap-3">
              {chairColorOptions.map((option) => (
                <ColorChoiceButton
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
          </aside>
        </>
      )}

      <button
        type="button"
        aria-pressed={isLightOn}
        aria-label={isLightOn ? "Turn off the light" : "Turn on the light"}
        onClick={toggleLight}
        className="fixed bottom-4 left-4 z-30 rounded-sm border border-current/30 px-4 py-3 text-sm text-current opacity-0 transition focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 sm:bottom-5 sm:left-5"
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
      heading: "",
      body: ""
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
    return `repeating-linear-gradient(0deg, transparent 0 10px, ${option.line} 10px 11px), repeating-linear-gradient(90deg, transparent 0 10px, ${option.line} 10px 11px)`;
  }

  if (option.pattern === "arc") {
    return `
      radial-gradient(ellipse at 12px 18px, transparent 0 8px, ${option.line} 9px 10px, transparent 11px),
      radial-gradient(ellipse at 30px 18px, transparent 0 8px, ${option.line} 9px 10px, transparent 11px),
      radial-gradient(ellipse at 12px 42px, transparent 0 8px, ${option.line} 9px 10px, transparent 11px),
      radial-gradient(ellipse at 30px 42px, transparent 0 8px, ${option.line} 9px 10px, transparent 11px)
    `;
  }

  return `radial-gradient(circle, ${option.accent} 0 1px, transparent 1px)`;
}
