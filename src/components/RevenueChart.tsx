"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface RevenueChartProps {
  /** Array of revenue data with date and amount */
  data: { date: string; amount: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Handle empty or missing data state
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-xs">
        Not enough data to display graph
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Income Overview
        </h3>
        {/* Optional: Add total or average here if needed */}
      </div>

      {/* Chart Container */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            {/* Gradient Definition for Bar Fill */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />{" "}
                {/* Emerald 500 */}
                <stop
                  offset="100%"
                  stopColor="#34d399"
                  stopOpacity={0.8}
                />{" "}
                {/* Emerald 400 */}
              </linearGradient>
            </defs>

            {/* Background Grid with Dashed Lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />

            {/* X-Axis: Date Labels */}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 500 }}
              dy={10} // Vertical padding for labels
              interval="preserveStartEnd" // Prevents overlapping text
            />

            {/* Y-Axis: Revenue Values */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#d1d5db" }}
              tickFormatter={(value: number) => {
                // Format large numbers with 'k' suffix
                return value >= 1000
                  ? `₹${(value / 1000).toFixed(0)}k`
                  : `₹${value}`;
              }}
            />

            {/* Custom Tooltip for Hover Interactions */}
            <Tooltip
              cursor={{ fill: "#f9fafb", radius: 4 }} // Background highlight on hover
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: "#111827",
                fontWeight: "bold",
                fontSize: "13px",
              }}
              labelStyle={{
                color: "#9ca3af",
                fontSize: "11px",
                marginBottom: "2px",
                textTransform: "uppercase",
              }}
              formatter={(value: number | undefined) => {
                // Format value with Indian rupee symbol and thousand separators
                return [`₹${value?.toLocaleString() ?? "0"}`, "Revenue"];
              }}
              labelFormatter={(label: string) => `Date: ${label}`}
            />

            {/* Data Bars */}
            <Bar
              dataKey="amount"
              fill="url(#barGradient)"
              radius={[6, 6, 6, 6]} // Rounded corners on all sides
              maxBarSize={50} // Maximum width limit
              barSize={30} // Default bar width
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
