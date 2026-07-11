"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSound() {
  const clickRef = useRef(null);
  const humRef = useRef(null);
  const audioContextRef = useRef(null);
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
      audioContextRef.current?.close();
      clickRef.current = null;
      humRef.current = null;
      audioContextRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (clickRef.current) clickRef.current.muted = muted;
    if (humRef.current) humRef.current.muted = muted;
  }, [muted]);

  const playClick = useCallback(() => {
    ensureAudio();
    const click = clickRef.current;
    if (muted) return;

    if (click) {
      click.currentTime = 0;
      click.play().catch(() => {
        playSyntheticClick(audioContextRef);
      });
      return;
    }

    playSyntheticClick(audioContextRef);
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

function playSyntheticClick(audioContextRef) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = audioContextRef.current || new AudioContext();
  audioContextRef.current = context;

  const now = context.currentTime;
  const output = context.createGain();
  const snap = context.createOscillator();
  const body = context.createOscillator();
  const snapGain = context.createGain();
  const bodyGain = context.createGain();

  output.gain.setValueAtTime(0.18, now);
  output.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

  snap.type = "square";
  snap.frequency.setValueAtTime(1250, now);
  snap.frequency.exponentialRampToValueAtTime(420, now + 0.035);
  snapGain.gain.setValueAtTime(0.32, now);
  snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

  body.type = "triangle";
  body.frequency.setValueAtTime(180, now + 0.018);
  body.frequency.exponentialRampToValueAtTime(90, now + 0.085);
  bodyGain.gain.setValueAtTime(0.001, now);
  bodyGain.gain.linearRampToValueAtTime(0.24, now + 0.018);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

  snap.connect(snapGain);
  body.connect(bodyGain);
  snapGain.connect(output);
  bodyGain.connect(output);
  output.connect(context.destination);

  snap.start(now);
  snap.stop(now + 0.04);
  body.start(now + 0.018);
  body.stop(now + 0.09);
}
