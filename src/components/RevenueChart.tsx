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
  data: { date: string; amount: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-xs">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Income Overview
        </h3>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 500 }}
              dy={10}
              interval={data.length > 7 ? "preserveStartEnd" : 0}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#d1d5db" }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`
              }
            />

            <Tooltip
              cursor={{ fill: "#f9fafb", radius: 4 }}
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
              formatter={(value: number | undefined) => [
                `₹${value?.toLocaleString() ?? "0"}`,
                "Revenue",
              ]}
            />

            <Bar
              dataKey="amount"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
