"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "./db";
import { seedIfEmpty } from "./seed";
import { readPeriods } from "./read";
import {
  addEvent,
  addPeriod,
  addScene,
  deleteEvent,
  deletePeriod,
  deleteScene,
} from "./mutations";
import { LOCAL_PLAYER_ID } from "./current-player";
import type { Period, Tone } from "./types";

export function useTimelineStore() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    const loaded = await readPeriods(db);
    setPeriods(loaded);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      await seedIfEmpty(db);
      const loaded = await readPeriods(db);
      if (!cancelled) {
        setPeriods(loaded);
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const createPeriod = useCallback(
    async (input: { title: string; dateRangeLabel: string; tone: Tone }) => {
      await addPeriod(db, { ...input, createdBy: LOCAL_PLAYER_ID });
      await reload();
    },
    [reload],
  );

  const createEvent = useCallback(
    async (periodId: string, input: { title: string; date: string; tone: Tone }) => {
      await addEvent(db, periodId, { ...input, createdBy: LOCAL_PLAYER_ID });
      await reload();
    },
    [reload],
  );

  const createScene = useCallback(
    async (eventId: string, input: { question: string; body: string; tone: Tone }) => {
      await addScene(db, eventId, { ...input, createdBy: LOCAL_PLAYER_ID });
      await reload();
    },
    [reload],
  );

  const removePeriod = useCallback(
    async (periodId: string) => {
      await deletePeriod(db, periodId);
      await reload();
    },
    [reload],
  );

  const removeEvent = useCallback(
    async (eventId: string) => {
      await deleteEvent(db, eventId);
      await reload();
    },
    [reload],
  );

  const removeScene = useCallback(
    async (sceneId: string) => {
      await deleteScene(db, sceneId);
      await reload();
    },
    [reload],
  );

  return {
    periods,
    isLoading,
    createPeriod,
    createEvent,
    createScene,
    removePeriod,
    removeEvent,
    removeScene,
  };
}
