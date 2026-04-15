"use client";

import { useState, useEffect } from "react";
import { subscribeToProducts } from "@/lib/firestore";
import type { Product } from "@/lib/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToProducts((products) => {
        setProducts(products);
        setLoading(false);
        setError(null);
      });
      return unsubscribe;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setLoading(false);
    }
  }, []);

  return { products, loading, error };
}