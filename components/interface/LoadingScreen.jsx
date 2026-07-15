"use client";

import { useProgress } from "@react-three/drei";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function getLoadingMessage(progress) {
  if (progress <= 30) return "Finding the light...";
  if (progress <= 60) return "Preparing the room...";
  if (progress <= 90) return "Arranging the details...";
  return "Almost ready...";
}

export default function LoadingScreen({ failed = false, onRetry }) {
  const { progress } = useProgress();
  const reducedMotion = useReducedMotion();
  const percentage = Math.min(100, Math.max(0, Math.round(progress || 0)));
  const message = useMemo(() => getLoadingMessage(percentage), [percentage]);

  return (
    <div className="absolute inset-0 isolate grid place-items-center overflow-hidden bg-[#080b10] px-6 text-[#e9edf0]">
      <div
        className={`absolute inset-0 opacity-60 ${
          reducedMotion ? "" : "motion-safe:animate-loader-breathe"
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(70, 83, 96, 0.22), transparent 42%), linear-gradient(180deg, #101722 0%, #080b10 56%, #050608 100%)"
        }}
      />
      <div className="relative z-10 w-full max-w-[min(28rem,calc(100vw-3rem))] text-center">
        <p className="text-[10px] uppercase tracking-[0.34em] text-white/45">Preparing the space...</p>
        <h1 className="mt-4 text-balance text-4xl font-medium leading-none text-white sm:text-6xl">
          Where Ideas Begin
        </h1>

        <div className="mx-auto mt-8 w-full max-w-sm" role="status" aria-live="polite" aria-atomic="true">
          {failed ? (
            <>
              <p className="text-sm text-white/72">Something essential could not load.</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-5 rounded-sm border border-white/28 px-5 py-2.5 text-sm text-white/78 transition hover:border-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-white/55">
                <span>{message}</span>
                <span>{percentage}%</span>
              </div>
              <div
                className="h-px w-full overflow-hidden bg-white/15"
                role="progressbar"
                aria-label="Loading 3D experience"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
              >
                <div
                  className="h-full bg-white/70 transition-[width] duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
