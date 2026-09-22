"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { PeriodSlide } from "./PeriodSlide";
import { SceneDetail } from "./SceneDetail";
import { useTimelineStore } from "@/lib/timeline/useTimelineStore";
import type { Scene, Tone } from "@/lib/timeline/types";

export function TimelineBoard() {
  const {
    periods,
    isLoading,
    createPeriod,
    createEvent,
    createScene,
    removePeriod,
    removeEvent,
    removeScene,
  } = useTimelineStore();
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [dateRangeLabel, setDateRangeLabel] = useState("");
  const [tone, setTone] = useState<Tone>("light");

  if (isLoading) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !dateRangeLabel.trim()) return;
    await createPeriod({ title: title.trim(), dateRangeLabel: dateRangeLabel.trim(), tone });
    setTitle("");
    setDateRangeLabel("");
    setTone("light");
    setIsAdding(false);
  }

  return (
    <>
      <div className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 sm:px-10">
        {periods.map((period) => (
          <PeriodSlide
            key={period.id}
            period={period}
            onZoomScene={setActiveScene}
            onAddEvent={createEvent}
            onAddScene={createScene}
            onDeletePeriod={removePeriod}
            onDeleteEvent={removeEvent}
            onDeleteScene={removeScene}
          />
        ))}

        {isAdding ? (
          <form
            onSubmit={handleSubmit}
            className="glass glass-edge flex w-64 shrink-0 snap-start flex-col gap-2 rounded-2xl p-4"
          >
            <input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Period title"
              className="rounded-md border border-glass-border bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-muted focus:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
            />
            <input
              value={dateRangeLabel}
              onChange={(event) => setDateRangeLabel(event.target.value)}
              placeholder="Date range (e.g. Year 0 – 140)"
              className="rounded-md border border-glass-border bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-muted focus:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
            />
            <select
              value={tone}
              onChange={(event) => setTone(event.target.value as Tone)}
              className="rounded-md border border-glass-border bg-transparent px-2 py-1.5 text-sm text-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 rounded-md bg-brass/20 px-2 py-1.5 text-sm text-paper transition-colors hover:bg-brass/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex w-64 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-glass-border py-8 text-muted transition-colors hover:border-brass/50 hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
          >
            <Plus aria-hidden className="size-5" />
            <span className="text-sm">Add period</span>
          </button>
        )}
      </div>

      <SceneDetail scene={activeScene} onClose={() => setActiveScene(null)} />
    </>
  );
}
