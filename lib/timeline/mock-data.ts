import type { Period } from "./types";

export const mockPeriods: Period[] = [
  {
    id: "p1",
    title: "The First Tide",
    dateRangeLabel: "Year 0 – 140",
    tone: "light",
    order: 0,
    events: [
      {
        id: "e1",
        title: "The Landing at Kesh",
        date: "Year 3",
        tone: "light",
        order: 0,
        scenes: [
          {
            id: "s1",
            question: "Does the first ship survive the reef?",
            body: "It runs aground at low tide instead of breaking apart — the crew wades the last quarter-mile carrying what they can, and the wreck becomes the first landmark anyone names.",
            tone: "light",
            order: 0,
          },
        ],
      },
      {
        id: "e2",
        title: "Founding of the Salt Court",
        date: "Year 40",
        tone: "light",
        order: 1,
        scenes: [
          {
            id: "s2",
            question: "Who does the first Court answer to?",
            body: "No one outside Kesh — the founding charter is written to name the sea itself as the only higher authority, a line later Courts will spend centuries arguing over.",
            tone: "light",
            order: 0,
          },
        ],
      },
    ],
  },
  {
    id: "p2",
    title: "The Long Drowning",
    dateRangeLabel: "Year 140 – 310",
    tone: "dark",
    order: 1,
    events: [
      {
        id: "e3",
        title: "The Levees Fail",
        date: "Year 162",
        tone: "dark",
        order: 0,
        scenes: [
          {
            id: "s3",
            question: "Who is blamed for the first levee?",
            body: "The engineers, publicly — privately, everyone in the Salt Court knows the levee was never meant to hold this much water; it was built for a coastline that no longer exists.",
            tone: "dark",
            order: 0,
          },
        ],
      },
      {
        id: "e4",
        title: "Exile of the Third House",
        date: "Year 205",
        tone: "dark",
        order: 1,
        scenes: [
          {
            id: "s4",
            question: "Does the Third House go quietly?",
            body: "No — they take the tide charts with them, and for a generation no one else can predict a safe crossing.",
            tone: "dark",
            order: 0,
          },
          {
            id: "s5",
            question: "Where do they go?",
            body: "North, along the drowned shore, to a spit of high ground the old charts don't even name.",
            tone: "light",
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: "p3",
    title: "The Reckoning Courts",
    dateRangeLabel: "Year 310 – 402",
    tone: "light",
    order: 2,
    events: [
      {
        id: "e5",
        title: "Return of the Tide Charts",
        date: "Year 318",
        tone: "light",
        order: 0,
        scenes: [],
      },
    ],
  },
];
