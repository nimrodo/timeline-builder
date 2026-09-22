"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PeriodSlide } from "./PeriodSlide";
import { SceneDetail } from "./SceneDetail";
import { useTimelineStore } from "@/lib/timeline/useTimelineStore";
import type { Scene } from "@/lib/timeline/types";

export function TimelineBoard() {
  const { periods, isLoading } = useTimelineStore();
  const [activeScene, setActiveScene] = useState<Scene | null>(null);

  if (isLoading) return null;

  return (
    <>
      <div className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 sm:px-10">
        {periods.map((period) => (
          <PeriodSlide
            key={period.id}
            period={period}
            onZoomScene={setActiveScene}
          />
        ))}

        <button
          type="button"
          className="flex w-64 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-glass-border py-8 text-muted transition-colors hover:border-brass/50 hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
        >
          <Plus aria-hidden className="size-5" />
          <span className="text-sm">Add period</span>
        </button>
      </div>

      <SceneDetail scene={activeScene} onClose={() => setActiveScene(null)} />
    </>
  );
}
