import Dexie, { type EntityTable } from "dexie";
import type { Tone } from "./types";

export interface PeriodRow {
  id: string;
  title: string;
  dateRangeLabel: string;
  tone: Tone;
  order: number;
  createdBy: string;
}

export interface EventRow {
  id: string;
  periodId: string;
  title: string;
  date: string;
  tone: Tone;
  order: number;
  createdBy: string;
}

export interface SceneRow {
  id: string;
  eventId: string;
  question: string;
  body: string;
  tone: Tone;
  order: number;
  createdBy: string;
}

export class TimelineDatabase extends Dexie {
  periods!: EntityTable<PeriodRow, "id">;
  events!: EntityTable<EventRow, "id">;
  scenes!: EntityTable<SceneRow, "id">;

  constructor() {
    super("timeline-builder");
    this.version(1).stores({
      periods: "id, order",
      events: "id, periodId, order",
      scenes: "id, eventId, order",
    });
  }
}

export const db = new TimelineDatabase();
