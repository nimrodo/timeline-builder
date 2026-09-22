import type { MouseEvent } from "react";
import { Search, Trash2 } from "lucide-react";
import { ToneDot } from "./ToneDot";
import type { Scene } from "@/lib/timeline/types";

export function SceneRow({
  scene,
  onZoom,
  onDelete,
}: {
  scene: Scene;
  onZoom: (scene: Scene) => void;
  onDelete: (sceneId: string) => Promise<void>;
}) {
  function handleDelete(event: MouseEvent) {
    event.stopPropagation();
    if (window.confirm(`Delete this scene?`)) {
      void onDelete(scene.id);
    }
  }

  return (
    <div className="group flex w-full items-center gap-1 rounded-md pl-4 pr-2 transition-colors hover:bg-white/[0.04]">
      <button
        type="button"
        onClick={() => onZoom(scene)}
        className="flex min-w-0 flex-1 items-center gap-2.5 py-1.5 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
      >
        <ToneDot tone={scene.tone} />
        <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-paper/80">
          {scene.question}
        </span>
        <Search
          aria-hidden
          className="size-3.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
        />
        <span className="sr-only">Examine scene</span>
      </button>
      <button
        type="button"
        onClick={handleDelete}
        aria-label="Delete scene"
        className="shrink-0 rounded-md p-1 text-muted transition-colors hover:text-paper/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
      >
        <Trash2 aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}
