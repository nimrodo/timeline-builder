import { Search } from "lucide-react";
import { ToneDot } from "./ToneDot";
import type { Scene } from "@/lib/timeline/types";

export function SceneRow({
  scene,
  onZoom,
}: {
  scene: Scene;
  onZoom: (scene: Scene) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onZoom(scene)}
      className="group flex w-full items-center gap-2.5 rounded-md py-1.5 pl-4 pr-2 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/70"
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
  );
}
