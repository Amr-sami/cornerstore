"use client";

import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, GENDER_LABELS, WATCH_BRANDS, type Category, type Gender } from "@/lib/types";

interface InventoryFiltersProps {
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
  selectedGender: Gender | null;
  onGenderChange: (gender: Gender | null) => void;
  selectedBrand: string | null;
  onBrandChange: (brand: string | null) => void;
}

export function InventoryFilters({
  selectedCategory,
  onCategoryChange,
  selectedGender,
  onGenderChange,
  selectedBrand,
  onBrandChange,
}: InventoryFiltersProps) {
  const categories: (Category | null)[] = [null, "watches", "perfumes", "sunglasses"];
  const genders: (Gender | null)[] = [null, "male", "female"];

  return (
    <div className="space-y-4">
      {/* Category Filter */}
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
      </div>

      {/* Gender Filter */}
      <div className="flex flex-wrap gap-2">
        {genders.map((g) => (
          <button
            key={g ?? "all"}
            onClick={() => onGenderChange(g)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedGender === g
                ? "bg-accent text-white"
                : "bg-white border border-border text-text-secondary hover:border-accent"
            )}
          >
            {g ? GENDER_LABELS[g] : "الكل"}
          </button>
        ))}
      </div>

      {/* Brand Filter (only for watches) */}
      {selectedCategory === "watches" && (
        <select
          value={selectedBrand || ""}
          onChange={(e) => onBrandChange(e.target.value || null)}
          className="px-4 py-2 rounded-lg border border-border bg-white"
        >
          <option value="">كل البراندات</option>
          {WATCH_BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}