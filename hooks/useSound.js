"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSound() {
  const clickRef = useRef(null);
  const humRef = useRef(null);
  const [muted, setMuted] = useState(false);

  const ensureAudio = useCallback(() => {
    if (clickRef.current || humRef.current) return;

    const click = new Audio("/audio/switch-click.mp3");
    const hum = new Audio("/audio/electrical-hum.mp3");

    click.volume = 0.28;
    hum.volume = 0.08;
    hum.loop = true;

    click.addEventListener("error", () => {
      clickRef.current = null;
    });
    hum.addEventListener("error", () => {
      humRef.current = null;
    });

    clickRef.current = click;
    humRef.current = hum;
  }, []);

  useEffect(() => {
    return () => {
      clickRef.current?.pause();
      humRef.current?.pause();
      clickRef.current = null;
      humRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (clickRef.current) clickRef.current.muted = muted;
    if (humRef.current) humRef.current.muted = muted;
  }, [muted]);

  const playClick = useCallback(() => {
    ensureAudio();
    const click = clickRef.current;
    if (!click || muted) return;

    click.currentTime = 0;
    click.play().catch(() => {});
  }, [ensureAudio, muted]);

  const startHum = useCallback(() => {
    ensureAudio();
    const hum = humRef.current;
    if (!hum || muted) return;

    hum.play().catch(() => {});
  }, [ensureAudio, muted]);

  const stopHum = useCallback(() => {
    const hum = humRef.current;
    if (!hum) return;

    hum.pause();
    hum.currentTime = 0;
  }, []);

  return {
    muted,
    setMuted,
    playClick,
    startHum,
    stopHum
  };
}
