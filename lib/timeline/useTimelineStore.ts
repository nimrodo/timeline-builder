"use client";

import { useEffect, useState } from "react";
import { db } from "./db";
import { seedIfEmpty } from "./seed";
import { readPeriods } from "./read";
import type { Period } from "./types";

export function useTimelineStore() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return { periods, isLoading };
}
