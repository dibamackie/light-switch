"use client";

import dynamic from "next/dynamic";
import { LightProvider } from "@/components/providers/LightProvider";
import SceneInterface from "@/components/interface/SceneInterface";
import LoadingScreen from "@/components/interface/LoadingScreen";

const ExperienceCanvas = dynamic(
  () => import("@/components/experience/ExperienceCanvas"),
  {
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

export default function Home() {
  return (
    <LightProvider>
      <main className="relative min-h-dvh overflow-hidden bg-[var(--page-bg)] text-[var(--page-fg)] transition-colors duration-700">
        <ExperienceCanvas />
        <SceneInterface />
      </main>
    </LightProvider>
  );
}
