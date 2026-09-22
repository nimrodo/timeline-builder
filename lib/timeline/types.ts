export type Tone = "light" | "dark";

export interface Scene {
  id: string;
  question: string;
  body: string;
  tone: Tone;
  order: number;
  createdBy: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  tone: Tone;
  order: number;
  createdBy: string;
  scenes: Scene[];
}

export interface Period {
  id: string;
  title: string;
  dateRangeLabel: string;
  tone: Tone;
  order: number;
  createdBy: string;
  events: TimelineEvent[];
}
