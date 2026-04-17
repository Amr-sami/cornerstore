"use client";

import { useState, useEffect } from "react";
import { subscribeToExpenses } from "@/lib/firestore";
import type { Expense } from "@/lib/types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToExpenses((data) => {
      setExpenses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { expenses, loading };
}
