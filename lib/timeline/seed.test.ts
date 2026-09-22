import { beforeEach, describe, expect, it } from "vitest";
import Dexie from "dexie";
import { TimelineDatabase } from "./db";
import { seedIfEmpty } from "./seed";

describe("seedIfEmpty", () => {
  let db: TimelineDatabase;

  beforeEach(async () => {
    await Dexie.delete("timeline-builder");
    db = new TimelineDatabase();
  });

  it("seeds 1-2 periods with nested events and scenes into an empty database", async () => {
    await seedIfEmpty(db);

    const periods = await db.periods.toArray();
    expect(periods.length).toBeGreaterThanOrEqual(1);
    expect(periods.length).toBeLessThanOrEqual(2);

    const events = await db.events.toArray();
    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(periods.some((p) => p.id === event.periodId)).toBe(true);
    }

    const scenes = await db.scenes.toArray();
    expect(scenes.length).toBeGreaterThan(0);
    for (const scene of scenes) {
      expect(events.some((e) => e.id === scene.eventId)).toBe(true);
    }
  });

  it("attributes seeded rows to the local player", async () => {
    await seedIfEmpty(db);

    const periods = await db.periods.toArray();
    expect(periods.every((p) => p.createdBy === "local-player")).toBe(true);
  });

  it("does not reseed when the database already has data", async () => {
    await seedIfEmpty(db);
    const firstPeriods = await db.periods.toArray();

    await seedIfEmpty(db);
    const secondPeriods = await db.periods.toArray();

    expect(secondPeriods).toEqual(firstPeriods);
  });
});
