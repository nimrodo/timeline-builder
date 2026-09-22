import { TimelineBoard } from "@/components/timeline/TimelineBoard";
import { mockPeriods } from "@/lib/timeline/mock-data";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-ink py-10">
      <header className="px-6 pb-8 sm:px-10">
        <h1 className="font-serif text-2xl text-paper">The Drowned Courts</h1>
        <p className="mt-1 text-sm text-muted">
          A shared history, examined one Period at a time.
        </p>
      </header>

      <TimelineBoard periods={mockPeriods} />
    </div>
  );
}
