"use client";

import { useMemo } from "react";
import { useSales } from "./useSales";
import { useReturns } from "./useReturns";
import { useProducts } from "./useProducts";
import { startOfDay, endOfDay, getThisMonthRange, isBetween } from "@/lib/utils";
import { startOfMonth, subMonths, format, eachDayOfInterval, isSameDay } from "date-fns";
import type { Sale, Return, Product } from "@/lib/types";

export function useInsights() {
  const { sales, loading: salesLoading } = useSales();
  const { returns, loading: returnsLoading } = useReturns();
  const { products, loading: productsLoading } = useProducts();

  const data = useMemo(() => {
    if (salesLoading || returnsLoading || productsLoading) return null;

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfDay(new Date(currentMonthStart.getTime() - 1));

    // 1. Current Month vs Last Month
    const currentMonthSales = sales.filter(s => new Date(s.saleDate) >= currentMonthStart);
    const lastMonthSales = sales.filter(s => {
      const d = new Date(s.saleDate);
      return d >= lastMonthStart && d <= lastMonthEnd;
    });

    const currentRevenue = currentMonthSales.reduce((sum, s) => sum + s.totalPrice, 0);
    const lastRevenue = lastMonthSales.reduce((sum, s) => sum + s.totalPrice, 0);
    
    const revenueGrowth = lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100;

    // 2. Revenue Trend (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });
    const trendData = days.map(day => {
      const daySales = sales.filter(s => isSameDay(new Date(s.saleDate), day));
      return {
        date: format(day, "MMM dd"),
        revenue: daySales.reduce((sum, s) => sum + s.totalPrice, 0),
        count: daySales.length
      };
    });

    // 3. Top Products (By Quantity)
    const productSales: Record<string, { id: string; name: string; brand?: string; qty: number; revenue: number }> = {};
    sales.forEach(s => {
      if (!productSales[s.productId]) {
        productSales[s.productId] = { id: s.productId, name: s.productName, brand: s.brand, qty: 0, revenue: 0 };
      }
      productSales[s.productId].qty += s.quantitySold;
      productSales[s.productId].revenue += s.totalPrice;
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // 4. Category Performance
    const categoryData: Record<string, number> = {};
    sales.forEach(s => {
      categoryData[s.category] = (categoryData[s.category] || 0) + s.totalPrice;
    });
    
    const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // 5. Discount Impact
    const totalDiscounts = sales.reduce((sum, s) => sum + (s.discountAmount || 0), 0);
    const potentialRevenue = sales.reduce((sum, s) => sum + (s.subtotal || s.totalPrice), 0);
    const discountPercent = potentialRevenue === 0 ? 0 : (totalDiscounts / potentialRevenue) * 100;

    return {
      metrics: {
        currentRevenue,
        lastRevenue,
        revenueGrowth,
        totalDiscounts,
        discountPercent,
        totalSales: sales.length,
        totalReturns: returns.length,
      },
      trendData,
      topProducts,
      categoryChartData
    };
  }, [sales, returns, products, salesLoading, returnsLoading, productsLoading]);

  return { data, loading: salesLoading || returnsLoading || productsLoading };
}
