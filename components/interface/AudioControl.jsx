"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useLight } from "@/components/providers/LightProvider";

export default function AudioControl() {
  const { muted, setMuted } = useLight();
  const Icon = muted ? VolumeX : Volume2;

  return (
    <button
      type="button"
      aria-label={muted ? "Unmute audio" : "Mute audio"}
      onClick={() => setMuted(!muted)}
      className="fixed bottom-4 right-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-current/20 bg-transparent text-current opacity-55 transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 sm:bottom-5 sm:right-5 sm:h-10 sm:w-10"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
