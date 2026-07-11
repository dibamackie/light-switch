"use client";

import { useEffect, useRef } from "react";
import { useLight } from "@/components/providers/LightProvider";
import AudioControl from "./AudioControl";

export default function SceneInterface() {
  const { isLightOn, hasInteracted, toggleLight, registerTarget } = useLight();
  const statementRef = useRef(null);

  useEffect(() => {
    registerTarget("statement", statementRef.current);
    return () => registerTarget("statement", null);
  }, [registerTarget]);

  return (
    <>
      <div
        ref={statementRef}
        className="pointer-events-none fixed left-6 top-8 z-20 max-w-[17rem] translate-y-2 opacity-0 sm:left-10 sm:top-10 md:max-w-sm"
      >
        <p className="text-balance text-xl font-medium leading-tight text-current sm:text-2xl">
          Light changes how we see a space.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-current/70">
          Switch it off. See it differently.
        </p>
      </div>

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
