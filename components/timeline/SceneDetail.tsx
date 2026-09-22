"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ToneDot } from "./ToneDot";
import type { Scene } from "@/lib/timeline/types";

const EASE = [0.4, 0, 0.2, 1] as const;

export function SceneDetail({
  scene,
  onClose,
}: {
  scene: Scene | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {scene && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/75 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Scene"
              initial={{ opacity: 0, scale: 0.97, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="glass glass-edge relative w-full max-w-[38rem] rounded-2xl p-8"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close scene"
                className="absolute right-4 top-4 rounded-md p-1.5 text-muted transition-colors hover:text-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
              >
                <X aria-hidden className="size-4" />
              </button>

              <div className="mb-3 flex items-center gap-2">
                <ToneDot tone={scene.tone} />
                <span className="text-[0.6875rem] text-muted">Scene</span>
              </div>

              <p className="font-serif text-[1.75rem] italic leading-snug text-paper">
                {scene.question}
              </p>

              <p className="mt-5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-paper/75">
                {scene.body}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
