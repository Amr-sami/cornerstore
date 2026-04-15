"use client";

import { RotateCcw } from "lucide-react";
import type { Sale } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { CATEGORY_LABELS, GENDER_LABELS } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";

interface SalesTableRowProps {
  sale: Sale;
  onReturn: (sale: Sale) => void;
}

export function SalesTableRow({ sale, onReturn }: SalesTableRowProps) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 px-2 text-sm">
        {formatDate(new Date(sale.saleDate))}
      </td>
      <td className="py-3 px-2">
        <div>
          <p className="font-medium">{sale.productName}</p>
          <p className="text-xs text-text-secondary">
            {CATEGORY_LABELS[sale.category]} • {GENDER_LABELS[sale.gender]}
          </p>
        </div>
      </td>
      <td className="py-3 px-2">
        <Badge variant={sale.category}>{CATEGORY_LABELS[sale.category]}</Badge>
      </td>
      <td className="py-3 px-2 text-sm">{sale.brand || "-"}</td>
      <td className="py-3 px-2">{sale.quantitySold}</td>
      <td className="py-3 px-2 text-sm">{formatPrice(sale.pricePerUnit)}</td>
      <td className="py-3 px-2 font-medium">{formatPrice(sale.totalPrice)}</td>
      <td className="py-3 px-2">
        {sale.isReturned ? (
          <Badge variant="returned">مرتجع</Badge>
        ) : (
          <Badge variant="sold">مباع</Badge>
        )}
      </td>
      <td className="py-3 px-2">
        <button
          onClick={() => onReturn(sale)}
          disabled={sale.isReturned}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-danger-light text-danger rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          مرتجع
        </button>
      </td>
    </tr>
  );
}