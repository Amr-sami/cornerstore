"use client";

import { RotateCcw, Calendar, Package, Tag } from "lucide-react";
import type { Sale } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { CATEGORY_LABELS, GENDER_LABELS } from "@/lib/types";
import { formatPrice, formatDate, cn } from "@/lib/utils";

interface SaleCardProps {
  sale: Sale;
  onReturn: (sale: Sale) => void;
}

export function SaleCard({ sale, onReturn }: SaleCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm border border-border transition-all",
        sale.isReturned && "opacity-75 bg-gray-50/50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(new Date(sale.saleDate))}
          </div>
          <h3 className="font-bold text-lg leading-tight">{sale.productName}</h3>
          {sale.brand && (
            <p className="text-sm text-text-secondary flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-accent" />
              {sale.brand}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {sale.isReturned ? (
            <Badge variant="returned">مرتجع</Badge>
          ) : (
            <Badge variant="sold">مباع</Badge>
          )}
          <Badge variant={sale.category}>{CATEGORY_LABELS[sale.category]}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-0.5">الكمية المباعة</p>
          <p className="text-lg font-bold leading-none">{sale.quantitySold} قطعة</p>
        </div>
        <div className="text-end">
          <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-0.5">سعر الوحدة</p>
          <p className="text-lg font-bold leading-none">{formatPrice(sale.pricePerUnit)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-text-secondary mb-0.5">الإجمالي</p>
          <p className="text-2xl font-black text-accent">{formatPrice(sale.totalPrice)}</p>
        </div>
        
        {!sale.isReturned && (
          <button
            onClick={() => onReturn(sale)}
            className="flex items-center gap-2 px-4 py-2.5 bg-danger-light text-danger rounded-xl hover:bg-red-200 transition-colors font-semibold shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            مرتجع
          </button>
        )}
      </div>
    </div>
  );
}
