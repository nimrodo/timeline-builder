import { beforeEach, describe, expect, it } from "vitest";
import Dexie from "dexie";
import { TimelineDatabase } from "./db";
import {
  addEvent,
  addPeriod,
  addScene,
  deleteEvent,
  deletePeriod,
  deleteScene,
} from "./mutations";

describe("mutations", () => {
  let db: TimelineDatabase;

  beforeEach(async () => {
    await Dexie.delete("timeline-builder");
    db = new TimelineDatabase();
  });

  describe("addPeriod", () => {
    it("inserts a period attributed to the given player, appended after existing periods", async () => {
      await db.periods.bulkAdd([
        {
          id: "p1",
          title: "Existing",
          dateRangeLabel: "y0-1",
          tone: "light",
          order: 0,
          createdBy: "local-player",
        },
      ]);

      await addPeriod(db, {
        title: "New Era",
        dateRangeLabel: "y2-3",
        tone: "dark",
        createdBy: "local-player",
      });

      const periods = await db.periods.orderBy("order").toArray();
      expect(periods).toHaveLength(2);
      expect(periods[1]).toMatchObject({
        title: "New Era",
        dateRangeLabel: "y2-3",
        tone: "dark",
        order: 1,
        createdBy: "local-player",
      });
      expect(periods[1].id).toBeTruthy();
    });
  });

  describe("addEvent", () => {
    it("inserts an event under the given period, appended after existing events", async () => {
      await db.periods.add({
        id: "p1",
        title: "P",
        dateRangeLabel: "y0-1",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      });
      await db.events.add({
        id: "e1",
        periodId: "p1",
        title: "Existing",
        date: "y1",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      });

      await addEvent(db, "p1", {
        title: "New Event",
        date: "y2",
        tone: "dark",
        createdBy: "local-player",
      });

      const events = await db.events
        .where("periodId")
        .equals("p1")
        .sortBy("order");
      expect(events).toHaveLength(2);
      expect(events[1]).toMatchObject({
        periodId: "p1",
        title: "New Event",
        date: "y2",
        tone: "dark",
        order: 1,
        createdBy: "local-player",
      });
    });
  });

  describe("addScene", () => {
    it("inserts a scene under the given event, appended after existing scenes", async () => {
      await db.events.add({
        id: "e1",
        periodId: "p1",
        title: "E",
        date: "y1",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      });
      await db.scenes.add({
        id: "s1",
        eventId: "e1",
        question: "Existing?",
        body: "existing",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      });

      await addScene(db, "e1", {
        question: "New?",
        body: "new body",
        tone: "dark",
        createdBy: "local-player",
      });

      const scenes = await db.scenes
        .where("eventId")
        .equals("e1")
        .sortBy("order");
      expect(scenes).toHaveLength(2);
      expect(scenes[1]).toMatchObject({
        eventId: "e1",
        question: "New?",
        body: "new body",
        tone: "dark",
        order: 1,
        createdBy: "local-player",
      });
    });
  });

  describe("deletePeriod", () => {
    it("removes the period and cascades to its events and their scenes", async () => {
      await db.periods.bulkAdd([
        {
          id: "p1",
          title: "P1",
          dateRangeLabel: "y0-1",
          tone: "light",
          order: 0,
          createdBy: "local-player",
        },
        {
          id: "p2",
          title: "P2",
          dateRangeLabel: "y2-3",
          tone: "dark",
          order: 1,
          createdBy: "local-player",
        },
      ]);
      await db.events.bulkAdd([
        {
          id: "e1",
          periodId: "p1",
          title: "E1",
          date: "y1",
          tone: "light",
          order: 0,
          createdBy: "local-player",
        },
        {
          id: "e2",
          periodId: "p2",
          title: "E2",
          date: "y2",
          tone: "dark",
          order: 0,
          createdBy: "local-player",
        },
      ]);
      await db.scenes.bulkAdd([
        {
          id: "s1",
          eventId: "e1",
          question: "q1",
          body: "b1",
          tone: "light",
          order: 0,
          createdBy: "local-player",
        },
        {
          id: "s2",
          eventId: "e2",
          question: "q2",
          body: "b2",
          tone: "dark",
          order: 0,
          createdBy: "local-player",
        },
      ]);

      await deletePeriod(db, "p1");

      expect(await db.periods.toArray()).toEqual([
        expect.objectContaining({ id: "p2" }),
      ]);
      expect(await db.events.toArray()).toEqual([
        expect.objectContaining({ id: "e2" }),
      ]);
      expect(await db.scenes.toArray()).toEqual([
        expect.objectContaining({ id: "s2" }),
      ]);
    });
  });

  describe("deleteEvent", () => {
    it("removes the event and cascades to its scenes, leaving the period and other events intact", async () => {
      await db.periods.add({
        id: "p1",
        title: "P1",
        dateRangeLabel: "y0-1",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      });
      await db.events.bulkAdd([
        {
          id: "e1",
          periodId: "p1",
          title: "E1",
          date: "y1",
          tone: "light",
          order: 0,
          createdBy: "local-player",
        },
        {
          id: "e2",
          periodId: "p1",
          title: "E2",
          date: "y2",
          tone: "dark",
          order: 1,
          createdBy: "local-player",
        },
      ]);
      await db.scenes.bulkAdd([
        {
          id: "s1",
          eventId: "e1",
          question: "q1",
          body: "b1",
          tone: "light",
          order: 0,
          createdBy: "local-player",
        },
        {
          id: "s2",
          eventId: "e2",
          question: "q2",
          body: "b2",
          tone: "dark",
          order: 0,
          createdBy: "local-player",
        },
      ]);

      await deleteEvent(db, "e1");

      expect(await db.periods.toArray()).toEqual([
        expect.objectContaining({ id: "p1" }),
      ]);
      expect(await db.events.toArray()).toEqual([
        expect.objectContaining({ id: "e2" }),
      ]);
      expect(await db.scenes.toArray()).toEqual([
        expect.objectContaining({ id: "s2" }),
      ]);
    });
  });

  describe("deleteScene", () => {
    it("removes just the scene, leaving its event intact", async () => {
      await db.events.add({
        id: "e1",
        periodId: "p1",
        title: "E1",
        date: "y1",
        tone: "light",
        order: 0,
        createdBy: "local-player",
      });
      await db.scenes.bulkAdd([
        {
          id: "s1",
          eventId: "e1",
          question: "q1",
          body: "b1",
          tone: "light",
          order: 0,
          createdBy: "local-player",
        },
        {
          id: "s2",
          eventId: "e1",
          question: "q2",
          body: "b2",
          tone: "dark",
          order: 1,
          createdBy: "local-player",
        },
      ]);

      await deleteScene(db, "s1");

      expect(await db.events.toArray()).toEqual([
        expect.objectContaining({ id: "e1" }),
      ]);
      expect(await db.scenes.toArray()).toEqual([
        expect.objectContaining({ id: "s2" }),
      ]);
    });
  });
});
