"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ToneDot } from "./ToneDot";
import { EventRow } from "./EventRow";
import type { Period, Scene } from "@/lib/timeline/types";

export function PeriodSlide({
  period,
  onZoomScene,
}: {
  period: Period;
  onZoomScene: (scene: Scene) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(
    period.events[0]?.id ?? null,
  );

  return (
    <section
      aria-label={period.title}
      className="glass glass-edge flex w-80 shrink-0 snap-start flex-col rounded-2xl"
    >
      <header className="px-4 pb-3 pt-4">
        <h2 className="font-serif text-[1.6rem] leading-tight text-paper">
          {period.title}
        </h2>
        <div className="mt-1.5 flex items-center gap-2">
          <ToneDot tone={period.tone} />
          <span className="font-mono text-[0.6875rem] tracking-tight text-muted">
            {period.dateRangeLabel}
          </span>
        </div>
      </header>

      <div className="border-t border-glass-border">
        {period.events.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            expanded={expandedId === event.id}
            onToggle={() =>
              setExpandedId((current) =>
                current === event.id ? null : event.id,
              )
            }
            onZoomScene={onZoomScene}
          />
        ))}
      </div>

      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2.5 text-left text-[0.8125rem] text-muted transition-colors hover:bg-white/[0.03] hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
      >
        <Plus aria-hidden className="size-3.5" />
        Add event
      </button>
    </section>
  );
}
