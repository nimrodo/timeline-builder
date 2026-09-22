import type { Tone } from "@/lib/timeline/types";

export function ToneDot({ tone }: { tone: Tone }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-1.5 shrink-0 rounded-full ${
        tone === "light" ? "bg-tone-light glow-light" : "bg-tone-dark glow-dark"
      }`}
    />
  );
}
