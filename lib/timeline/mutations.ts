import type { TimelineDatabase } from "./db";
import type { Tone } from "./types";

export async function addPeriod(
  db: TimelineDatabase,
  input: { title: string; dateRangeLabel: string; tone: Tone; createdBy: string },
): Promise<void> {
  const order = await db.periods.count();
  await db.periods.add({
    id: crypto.randomUUID(),
    order,
    ...input,
  });
}

export async function addEvent(
  db: TimelineDatabase,
  periodId: string,
  input: { title: string; date: string; tone: Tone; createdBy: string },
): Promise<void> {
  const order = await db.events.where("periodId").equals(periodId).count();
  await db.events.add({
    id: crypto.randomUUID(),
    periodId,
    order,
    ...input,
  });
}

export async function addScene(
  db: TimelineDatabase,
  eventId: string,
  input: { question: string; body: string; tone: Tone; createdBy: string },
): Promise<void> {
  const order = await db.scenes.where("eventId").equals(eventId).count();
  await db.scenes.add({
    id: crypto.randomUUID(),
    eventId,
    order,
    ...input,
  });
}

export async function deletePeriod(
  db: TimelineDatabase,
  periodId: string,
): Promise<void> {
  await db.transaction("rw", db.periods, db.events, db.scenes, async () => {
    const eventIds = await db.events
      .where("periodId")
      .equals(periodId)
      .primaryKeys();
    await db.scenes.where("eventId").anyOf(eventIds).delete();
    await db.events.where("periodId").equals(periodId).delete();
    await db.periods.delete(periodId);
  });
}

export async function deleteEvent(
  db: TimelineDatabase,
  eventId: string,
): Promise<void> {
  await db.transaction("rw", db.events, db.scenes, async () => {
    await db.scenes.where("eventId").equals(eventId).delete();
    await db.events.delete(eventId);
  });
}

export async function deleteScene(
  db: TimelineDatabase,
  sceneId: string,
): Promise<void> {
  await db.scenes.delete(sceneId);
}
