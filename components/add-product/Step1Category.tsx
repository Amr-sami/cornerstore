"use client";

import { Watch, FlaskConical, Glasses } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

const categories = [
  { value: "watches" as Category, label: "ساعات", icon: Watch },
  { value: "perfumes" as Category, label: "برفانات", icon: FlaskConical },
  { value: "sunglasses" as Category, label: "نظارات", icon: Glasses },
];

interface Step1CategoryProps {
  selected: Category | null;
  onSelect: (category: Category) => void;
}

export function Step1Category({ selected, onSelect }: Step1CategoryProps) {
  return (
    <div>
      <h3 className="text-center font-semibold mb-6">اختر الصنف</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selected === cat.value;

          return (
            <button
              key={cat.value}
              onClick={() => onSelect(cat.value)}
              className={cn(
                "flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all",
                isSelected
                  ? "border-accent bg-accent-light text-accent"
                  : "border-border bg-white hover:border-accent/50"
              )}
            >
              <Icon className={cn("w-16 h-16 mb-4", isSelected && "text-accent")} />
              <span className="text-xl font-semibold">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}