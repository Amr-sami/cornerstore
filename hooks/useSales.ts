"use client";

import { useState, useEffect } from "react";
import { subscribeToSales } from "@/lib/firestore";
import type { Sale } from "@/lib/types";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToSales((sales) => {
        setSales(sales);
        setLoading(false);
        setError(null);
      });
      return unsubscribe;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setLoading(false);
    }
  }, []);

  return { sales, loading, error };
}