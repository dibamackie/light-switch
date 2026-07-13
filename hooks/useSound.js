"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSound() {
  const audioContextRef = useRef(null);
  const humRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (muted) stopSyntheticHum(humRef);
  }, [muted]);

  useEffect(() => {
    return () => {
      stopSyntheticHum(humRef);
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  const playClick = useCallback(() => {
    if (muted) return;
    playSyntheticClick(audioContextRef);
  }, [muted]);

  const startHum = useCallback(() => {
    if (muted) return;
    startSyntheticHum(audioContextRef, humRef);
  }, [muted]);

  const stopHum = useCallback(() => {
    stopSyntheticHum(humRef);
  }, []);

  return {
    muted,
    setMuted,
    playClick,
    startHum,
    stopHum
  };
}

function getAudioContext(audioContextRef) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  const context = audioContextRef.current || new AudioContext();
  audioContextRef.current = context;
  return context;
}

function playSyntheticClick(audioContextRef) {
  const context = getAudioContext(audioContextRef);
  if (!context) return;

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

function startSyntheticHum(audioContextRef, humRef) {
  if (humRef.current) return;

  const context = getAudioContext(audioContextRef);
  if (!context) return;

  const now = context.currentTime;
  const output = context.createGain();
  const low = context.createOscillator();
  const high = context.createOscillator();
  const lowGain = context.createGain();
  const highGain = context.createGain();

  low.type = "sine";
  low.frequency.value = 60;
  lowGain.gain.value = 0.035;

  high.type = "sine";
  high.frequency.value = 120;
  highGain.gain.value = 0.018;

  output.gain.setValueAtTime(0.001, now);
  output.gain.linearRampToValueAtTime(1, now + 0.2);

  low.connect(lowGain);
  high.connect(highGain);
  lowGain.connect(output);
  highGain.connect(output);
  output.connect(context.destination);

  low.start(now);
  high.start(now);

  humRef.current = { low, high, output };
}

function stopSyntheticHum(humRef) {
  const hum = humRef.current;
  if (!hum) return;

  hum.output.disconnect();
  hum.low.stop();
  hum.high.stop();
  humRef.current = null;
}
