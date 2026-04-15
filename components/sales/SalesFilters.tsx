"use client";

import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

interface SalesFiltersProps {
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
  selectedStatus: "all" | "sold" | "returned";
  onStatusChange: (status: "all" | "sold" | "returned") => void;
}

export function SalesFilters({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: SalesFiltersProps) {
  const categories: (Category | null)[] = [null, "watches", "perfumes", "sunglasses"];
  const statuses = [
    { value: "all", label: "الكل" },
    { value: "sold", label: "مباع" },
    { value: "returned", label: "مرتجع" },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat ?? "all"}
          onClick={() => onCategoryChange(cat)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            selectedCategory === cat
              ? "bg-accent text-white"
              : "bg-white border border-border text-text-secondary hover:border-accent"
          )}
        >
          {cat ? CATEGORY_LABELS[cat] : "الكل"}
        </button>
      ))}

      <div className="w-full border-b border-border my-2" />

      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            selectedStatus === status.value
              ? "bg-success text-white"
              : "bg-white border border-border text-text-secondary hover:border-success"
          )}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}