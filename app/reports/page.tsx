"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { DateRangePicker } from "@/components/reports/DateRangePicker";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesTable } from "@/components/sales/SalesTable";
import { SaleCard } from "@/components/sales/SaleCard";
import { useSales } from "@/hooks/useSales";
import { useReturns } from "@/hooks/useReturns";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, startOfDay, endOfDay, isBetween, getTodayRange, getThisMonthRange } from "@/lib/utils";
import { DollarSign, ShoppingCart, RotateCcw } from "lucide-react";
import type { Sale } from "@/lib/types";

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const { sales, loading: salesLoading } = useSales();
  const { returns, loading: returnsLoading } = useReturns();

  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  useEffect(() => {
    const range = searchParams.get("range");
    let start = new Date();
    let end = new Date();

    if (range === "today") {
      ({ start, end } = getTodayRange());
    } else if (range === "this-month" || range === "returns-this-month") {
      ({ start, end } = getThisMonthRange());
    } else {
      ({ start, end } = getThisMonthRange());
    }

    setDateRange({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0]
    });
  }, [searchParams]);

  const filteredData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return { sales: [], returns: [] };

    const start = startOfDay(new Date(dateRange.start));
    const end = endOfDay(new Date(dateRange.end));

    const fSales = sales.filter((s) => isBetween(new Date(s.saleDate), start, end));
    const fReturns = returns.filter((r) => isBetween(new Date(r.returnDate), start, end));

    return { sales: fSales, returns: fReturns };
  }, [sales, returns, dateRange]);

  const stats = useMemo(() => {
    const totalSales = filteredData.sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalReturns = filteredData.returns.length;
    const totalQty = filteredData.sales.reduce((sum, s) => sum + s.quantitySold, 0);

    return { totalSales, totalReturns, totalQty };
  }, [filteredData]);

  if (salesLoading || returnsLoading) {
    return (
      <AppShell title="التقارير">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="التقارير والاحصائيات">
      <div className="space-y-6">
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onRangeChange={(start, end) => setDateRange({ start, end })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="إجمالي المبيعات"
            value={formatPrice(stats.totalSales)}
            icon={DollarSign}
            color="success"
          />
          <StatCard
            title="كمية المبيعات"
            value={`${stats.totalQty} قطعة`}
            icon={ShoppingCart}
            color="accent"
          />
          <StatCard
            title="عدد المرتجعات"
            value={stats.totalReturns}
            subtitle="مرتجع"
            icon={RotateCcw}
            color="danger"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg px-1">تفاصيل المبيعات للفترة المختارة</h3>
          
          {filteredData.sales.length === 0 ? (
            <EmptyState type="sales" />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <SalesTable sales={filteredData.sales} onReturn={() => {}} />
              </div>

              {/* Mobile Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {filteredData.sales.map((sale) => (
                  <SaleCard key={sale.id} sale={sale} onReturn={() => {}} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
