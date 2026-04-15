"use client";

import { AppShell } from "@/components/layout/AppShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { RecentSalesList } from "@/components/dashboard/RecentSalesList";

export default function DashboardPage() {
  return (
    <AppShell title="لوحة التحكم">
      <div className="space-y-6">
        <StatsGrid />
        
        <div className="grid md:grid-cols-2 gap-6">
          <LowStockAlert />
          <RecentSalesList />
        </div>
      </div>
    </AppShell>
  );
}