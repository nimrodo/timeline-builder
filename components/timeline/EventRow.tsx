"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { ToneDot } from "./ToneDot";
import { SceneRow } from "./SceneRow";
import type { Scene, TimelineEvent, Tone } from "@/lib/timeline/types";

const EASE = [0.4, 0, 0.2, 1] as const;

export function EventRow({
  event,
  expanded,
  onToggle,
  onZoomScene,
  onAddScene,
  onDeleteEvent,
  onDeleteScene,
}: {
  event: TimelineEvent;
  expanded: boolean;
  onToggle: () => void;
  onZoomScene: (scene: Scene) => void;
  onAddScene: (
    eventId: string,
    input: { question: string; body: string; tone: Tone },
  ) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onDeleteScene: (sceneId: string) => Promise<void>;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState("");
  const [body, setBody] = useState("");
  const [tone, setTone] = useState<Tone>("light");

  async function handleSubmit(formEvent: FormEvent) {
    formEvent.preventDefault();
    if (!question.trim() || !body.trim()) return;
    await onAddScene(event.id, {
      question: question.trim(),
      body: body.trim(),
      tone,
    });
    setQuestion("");
    setBody("");
    setTone("light");
    setIsAdding(false);
  }

  function handleDelete() {
    if (
      window.confirm(`Delete "${event.title}" and all of its scenes?`)
    ) {
      void onDeleteEvent(event.id);
    }
  }

  return (
    <div className="border-b border-glass-border last:border-b-0">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
        >
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="flex size-4 shrink-0 items-center justify-center text-muted"
          >
            <ChevronRight aria-hidden className="size-3.5" />
          </motion.span>
          <ToneDot tone={event.tone} />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-paper">
            {event.title}
          </span>
          <span className="shrink-0 font-mono text-[0.6875rem] tracking-tight text-muted">
            {event.date}
          </span>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${event.title}`}
          className="shrink-0 rounded-md p-1 mr-2 text-muted transition-colors hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
        >
          <Trash2 aria-hidden className="size-3.5" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="scenes"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-l border-glass-border ml-[1.55rem] py-1">
              {event.scenes.map((scene) => (
                <SceneRow
                  key={scene.id}
                  scene={scene}
                  onZoom={onZoomScene}
                  onDelete={onDeleteScene}
                />
              ))}
              {isAdding ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-2 py-1.5 pl-4 pr-2"
                >
                  <input
                    autoFocus
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Question"
                    className="rounded-md border border-glass-border bg-transparent px-2 py-1.5 text-[0.8125rem] text-paper placeholder:text-muted focus:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
                  />
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Body"
                    rows={2}
                    className="rounded-md border border-glass-border bg-transparent px-2 py-1.5 text-[0.8125rem] text-paper placeholder:text-muted focus:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
                  />
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="rounded-md border border-glass-border bg-transparent px-2 py-1.5 text-[0.8125rem] text-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-md bg-brass/20 px-2 py-1 text-[0.8125rem] text-paper transition-colors hover:bg-brass/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="flex-1 rounded-md px-2 py-1 text-[0.8125rem] text-muted transition-colors hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="flex w-full items-center gap-2.5 rounded-md py-1.5 pl-4 pr-2 text-left text-[0.8125rem] text-muted transition-colors hover:bg-white/[0.04] hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
                >
                  <Plus aria-hidden className="size-3.5" />
                  Add scene
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
