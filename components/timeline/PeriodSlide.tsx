"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ToneDot } from "./ToneDot";
import { EventRow } from "./EventRow";
import type { Period, Scene, Tone } from "@/lib/timeline/types";

export function PeriodSlide({
  period,
  onZoomScene,
  onAddEvent,
  onAddScene,
  onDeletePeriod,
  onDeleteEvent,
  onDeleteScene,
}: {
  period: Period;
  onZoomScene: (scene: Scene) => void;
  onAddEvent: (
    periodId: string,
    input: { title: string; date: string; tone: Tone },
  ) => Promise<void>;
  onAddScene: (
    eventId: string,
    input: { question: string; body: string; tone: Tone },
  ) => Promise<void>;
  onDeletePeriod: (periodId: string) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onDeleteScene: (sceneId: string) => Promise<void>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(
    period.events[0]?.id ?? null,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [tone, setTone] = useState<Tone>("light");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !date.trim()) return;
    await onAddEvent(period.id, { title: title.trim(), date: date.trim(), tone });
    setTitle("");
    setDate("");
    setTone("light");
    setIsAdding(false);
  }

  function handleDelete() {
    if (
      window.confirm(
        `Delete "${period.title}" and all of its events and scenes?`,
      )
    ) {
      void onDeletePeriod(period.id);
    }
  }

  return (
    <section
      aria-label={period.title}
      className="glass glass-edge flex w-80 shrink-0 snap-start flex-col rounded-2xl"
    >
      <header className="flex items-start justify-between gap-2 px-4 pb-3 pt-4">
        <div>
          <h2 className="font-serif text-[1.6rem] leading-tight text-paper">
            {period.title}
          </h2>
          <div className="mt-1.5 flex items-center gap-2">
            <ToneDot tone={period.tone} />
            <span className="font-mono text-[0.6875rem] tracking-tight text-muted">
              {period.dateRangeLabel}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${period.title}`}
          className="shrink-0 rounded-md p-1 text-muted transition-colors hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
        >
          <Trash2 aria-hidden className="size-3.5" />
        </button>
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
            onAddScene={onAddScene}
            onDeleteEvent={onDeleteEvent}
            onDeleteScene={onDeleteScene}
          />
        ))}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-3">
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Event title"
            className="rounded-md border border-glass-border bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-muted focus:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
          />
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            placeholder="Date (e.g. Year 3)"
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
          <div className="flex gap-2">
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
          className="flex items-center gap-2 px-3 py-2.5 text-left text-[0.8125rem] text-muted transition-colors hover:bg-white/[0.03] hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
        >
          <Plus aria-hidden className="size-3.5" />
          Add event
        </button>
      )}
    </section>
  );
}
