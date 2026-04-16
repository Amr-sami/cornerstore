"use client";

import { RotateCcw, Printer } from "lucide-react";
import type { Sale } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { CATEGORY_LABELS, GENDER_LABELS } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";

interface SalesTableRowProps {
  sale: Sale;
  onReturn: (sale: Sale) => void;
  onPrint: (sale: Sale) => void;
}

export function SalesTableRow({ sale, onReturn, onPrint }: SalesTableRowProps) {
  const saleDate = new Date(sale.saleDate);

  return (
    <tr className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors font-cairo">
      <td className="py-4 px-4 text-sm">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-text-primary whitespace-nowrap">
            {formatDate(saleDate)}
          </span>
          <span className="text-xs text-text-secondary opacity-80">
            {saleDate.toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </td>
      <td className="py-4 px-4 font-medium">{sale.productName}</td>
      <td className="py-4 px-4">
        <Badge variant={sale.category}>{CATEGORY_LABELS[sale.category]}</Badge>
      </td>
      <td className="py-4 px-4 text-sm text-text-secondary">{sale.brand || "-"}</td>
      <td className="py-4 px-4 text-center font-semibold">{sale.quantitySold}</td>
      <td className="py-4 px-4 text-sm font-medium">{formatPrice(sale.pricePerUnit)}</td>
      <td className="py-4 px-4">
        <div className="flex flex-col">
          <span className="font-bold text-accent">{formatPrice(sale.totalPrice)}</span>
          {sale.discountAmount && sale.discountAmount > 0 && (
            <div className="flex flex-col text-[10px] items-start mt-0.5">
              <span className="text-text-secondary line-through italic opacity-60">
                {formatPrice(sale.subtotal)}
              </span>
              <span className="text-danger font-bold">
                خصم {sale.discountType === "percentage" ? `${sale.discountValue}%` : formatPrice(sale.discountAmount)}
              </span>
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        {sale.isReturned ? (
          <Badge variant="returned">مرتجع</Badge>
        ) : (
          <Badge variant="sold">مباع</Badge>
        )}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {!sale.isReturned && (
            <button
              onClick={() => onPrint(sale)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent-light text-accent rounded-lg hover:bg-accent hover:text-white transition-all shadow-sm font-bold border border-accent/20"
              title="طباعة"
            >
              <Printer className="w-4 h-4" />
              طباعة
            </button>
          )}
          <button
            onClick={() => onReturn(sale)}
            disabled={sale.isReturned}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-danger-light text-danger rounded-lg hover:bg-danger hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-bold border border-danger/20"
            title="مرتجع"
          >
            <RotateCcw className="w-4 h-4" />
            مرتجع
          </button>
        </div>
      </td>
    </tr>
  );
}