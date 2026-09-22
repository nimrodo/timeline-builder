import type { TimelineDatabase } from "./db";
import type { Period } from "./types";

export async function readPeriods(db: TimelineDatabase): Promise<Period[]> {
  const [periodRows, eventRows, sceneRows] = await Promise.all([
    db.periods.orderBy("order").toArray(),
    db.events.orderBy("order").toArray(),
    db.scenes.orderBy("order").toArray(),
  ]);

  const scenesByEventId = new Map<string, typeof sceneRows>();
  for (const scene of sceneRows) {
    const scenes = scenesByEventId.get(scene.eventId) ?? [];
    scenes.push(scene);
    scenesByEventId.set(scene.eventId, scenes);
  }

  const eventsByPeriodId = new Map<
    string,
    (typeof eventRows[number] & { scenes: typeof sceneRows })[]
  >();
  for (const event of eventRows) {
    const events = eventsByPeriodId.get(event.periodId) ?? [];
    events.push({ ...event, scenes: scenesByEventId.get(event.id) ?? [] });
    eventsByPeriodId.set(event.periodId, events);
  }

  return periodRows.map((period) => ({
    ...period,
    events: eventsByPeriodId.get(period.id) ?? [],
  }));
}
