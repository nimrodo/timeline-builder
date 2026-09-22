import { beforeEach, describe, expect, it } from "vitest";
import Dexie from "dexie";
import { TimelineDatabase } from "./db";
import { readPeriods } from "./read";

describe("readPeriods", () => {
  let db: TimelineDatabase;

  beforeEach(async () => {
    await Dexie.delete("timeline-builder");
    db = new TimelineDatabase();
  });

  it("returns an empty array for an empty database", async () => {
    expect(await readPeriods(db)).toEqual([]);
  });

  it("assembles periods with nested events and scenes, ordered by `order`", async () => {
    await db.periods.bulkAdd([
      {
        id: "p2",
        title: "Second",
        dateRangeLabel: "later",
        tone: "dark",
        order: 1,
        createdBy: "local-player",
      },
      {
        id: "p1",
        title: "First",
        dateRangeLabel: "earlier",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      },
    ]);
    await db.events.bulkAdd([
      {
        id: "e1",
        periodId: "p1",
        title: "Event 1",
        date: "y1",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      },
    ]);
    await db.scenes.bulkAdd([
      {
        id: "s1",
        eventId: "e1",
        question: "q?",
        body: "b",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      },
    ]);

    const periods = await readPeriods(db);

    expect(periods.map((p) => p.id)).toEqual(["p1", "p2"]);
    expect(periods[0].events).toEqual([
      expect.objectContaining({
        id: "e1",
        scenes: [expect.objectContaining({ id: "s1" })],
      }),
    ]);
    expect(periods[1].events).toEqual([]);
  });
});
