"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

const COLORS = ["#C9A84C", "#2D2D2D", "#666666"];

interface CategoryPieChartProps {
  data: { name: string; value: number }[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data.map(item => ({
    ...item,
    displayName: CATEGORY_LABELS[item.name as Category] || item.name
  }));

  return (
    <div className="h-[300px] w-full bg-white rounded-xl p-4 shadow-sm border border-border">
      <h3 className="text-sm font-semibold mb-4 text-text-secondary">توزيع المبيعات حسب الصنف</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="displayName"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontFamily: "var(--font-cairo)" }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            formatter={(value) => <span className="text-xs font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
