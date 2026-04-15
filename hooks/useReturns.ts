"use client";

import { useState, useEffect } from "react";
import { subscribeToReturns } from "@/lib/firestore";
import type { Return } from "@/lib/types";

export function useReturns() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToReturns((returns) => {
        setReturns(returns);
        setLoading(false);
        setError(null);
      });
      return unsubscribe;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setLoading(false);
    }
  }, []);

  return { returns, loading, error };
}