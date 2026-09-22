import type { TimelineDatabase } from "./db";
import { LOCAL_PLAYER_ID } from "./current-player";

export async function seedIfEmpty(db: TimelineDatabase): Promise<void> {
  const periodCount = await db.periods.count();
  if (periodCount > 0) return;

  await db.transaction("rw", db.periods, db.events, db.scenes, async () => {
    await db.periods.bulkAdd([
      {
        id: "p1",
        title: "The First Tide",
        dateRangeLabel: "Year 0 – 140",
        tone: "light",
        order: 0,
        createdBy: LOCAL_PLAYER_ID,
      },
      {
        id: "p2",
        title: "The Long Drowning",
        dateRangeLabel: "Year 140 – 310",
        tone: "dark",
        order: 1,
        createdBy: LOCAL_PLAYER_ID,
      },
    ]);

    await db.events.bulkAdd([
      {
        id: "e1",
        periodId: "p1",
        title: "The Landing at Kesh",
        date: "Year 3",
        tone: "light",
        order: 0,
        createdBy: LOCAL_PLAYER_ID,
      },
      {
        id: "e2",
        periodId: "p1",
        title: "Founding of the Salt Court",
        date: "Year 40",
        tone: "light",
        order: 1,
        createdBy: LOCAL_PLAYER_ID,
      },
      {
        id: "e3",
        periodId: "p2",
        title: "The Levees Fail",
        date: "Year 162",
        tone: "dark",
        order: 0,
        createdBy: LOCAL_PLAYER_ID,
      },
    ]);

    await db.scenes.bulkAdd([
      {
        id: "s1",
        eventId: "e1",
        question: "Does the first ship survive the reef?",
        body: "It runs aground at low tide instead of breaking apart — the crew wades the last quarter-mile carrying what they can, and the wreck becomes the first landmark anyone names.",
        tone: "light",
        order: 0,
        createdBy: LOCAL_PLAYER_ID,
      },
      {
        id: "s2",
        eventId: "e2",
        question: "Who does the first Court answer to?",
        body: "No one outside Kesh — the founding charter is written to name the sea itself as the only higher authority, a line later Courts will spend centuries arguing over.",
        tone: "light",
        order: 0,
        createdBy: LOCAL_PLAYER_ID,
      },
      {
        id: "s3",
        eventId: "e3",
        question: "Who is blamed for the first levee?",
        body: "The engineers, publicly — privately, everyone in the Salt Court knows the levee was never meant to hold this much water; it was built for a coastline that no longer exists.",
        tone: "dark",
        order: 0,
        createdBy: LOCAL_PLAYER_ID,
      },
    ]);
  });
}
