"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";
import { ToneDot } from "./ToneDot";
import { SceneRow } from "./SceneRow";
import type { Scene, TimelineEvent } from "@/lib/timeline/types";

const EASE = [0.4, 0, 0.2, 1] as const;

export function EventRow({
  event,
  expanded,
  onToggle,
  onZoomScene,
}: {
  event: TimelineEvent;
  expanded: boolean;
  onToggle: () => void;
  onZoomScene: (scene: Scene) => void;
}) {
  return (
    <div className="border-b border-glass-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
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
                <SceneRow key={scene.id} scene={scene} onZoom={onZoomScene} />
              ))}
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-md py-1.5 pl-4 pr-2 text-left text-[0.8125rem] text-muted transition-colors hover:bg-white/[0.04] hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
              >
                <Plus aria-hidden className="size-3.5" />
                Add scene
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
