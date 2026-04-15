"use client";

import { useSales } from "@/hooks/useSales";
import { Badge } from "../ui/Badge";
import { CATEGORY_LABELS, GENDER_LABELS } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";

export function RecentSalesList() {
  const { sales, loading } = useSales();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentSales = sales.slice(0, 10);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-border overflow-x-auto">
      <h3 className="font-semibold mb-4">آخر المبيعات</h3>

      {recentSales.length === 0 ? (
        <p className="text-text-secondary text-center py-8">
          لا توجد مبيعات بعد
        </p>
      ) : (
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-sm text-text-secondary border-b border-border">
              <th className="text-start pb-3 px-2">التاريخ</th>
              <th className="text-start pb-3 px-2">المنتج</th>
              <th className="text-start pb-3 px-2">الكمية</th>
              <th className="text-start pb-3 px-2">الإجمالي</th>
              <th className="text-start pb-3 px-2">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale) => (
              <tr
                key={sale.id}
                className="border-b border-border last:border-0"
              >
                <td className="py-3 px-2 text-sm">
                  {formatDate(new Date(sale.saleDate))}
                </td>
                <td className="py-3 px-2">
                  <div>
                    <p className="font-medium">{sale.productName}</p>
                    <p className="text-xs text-text-secondary">
                      {CATEGORY_LABELS[sale.category]} •{" "}
                      {GENDER_LABELS[sale.gender]}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-2">{sale.quantitySold}</td>
                <td className="py-3 px-2 font-medium">
                  {formatPrice(sale.totalPrice)}
                </td>
                <td className="py-3 px-2">
                  {sale.isReturned ? (
                    <Badge variant="returned">مرتجع</Badge>
                  ) : (
                    <Badge variant="sold">مباع</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}