"use client";

import type { Sale } from "@/lib/types";
import { SalesTableRow } from "./SalesTableRow";

interface SalesTableProps {
  sales: Sale[];
  onReturn: (sale: Sale) => void;
}

export function SalesTable({ sales, onReturn }: SalesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="text-sm text-text-secondary border-b border-border bg-gray-50">
            <th className="text-start pb-3 px-4 py-3">التاريخ</th>
            <th className="text-start pb-3 px-4 py-3">المنتج</th>
            <th className="text-start pb-3 px-4 py-3">الصنف</th>
            <th className="text-start pb-3 px-4 py-3">البراند</th>
            <th className="text-start pb-3 px-4 py-3">الكمية</th>
            <th className="text-start pb-3 px-4 py-3">السعر</th>
            <th className="text-start pb-3 px-4 py-3">الإجمالي</th>
            <th className="text-start pb-3 px-4 py-3">الحالة</th>
            <th className="text-start pb-3 px-4 py-3">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <SalesTableRow key={sale.id} sale={sale} onReturn={onReturn} />
          ))}
        </tbody>
      </table>
    </div>
  );
}