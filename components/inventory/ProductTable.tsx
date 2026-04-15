"use client";

import type { Product } from "@/lib/types";
import { ProductTableRow } from "./ProductTableRow";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onSell: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete, onSell }: ProductTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="text-sm text-text-secondary border-b border-border bg-gray-50">
            <th className="text-start pb-3 px-4 py-3">اسم المنتج</th>
            <th className="text-start pb-3 px-4 py-3">الصنف</th>
            <th className="text-start pb-3 px-4 py-3">الجنس</th>
            <th className="text-start pb-3 px-4 py-3">البراند</th>
            <th className="text-start pb-3 px-4 py-3">الكمية</th>
            <th className="text-start pb-3 px-4 py-3">السعر</th>
            <th className="text-start pb-3 px-4 py-3">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              onSell={onSell}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}