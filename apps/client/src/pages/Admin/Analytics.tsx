import React, { useState } from "react";
import Icon from "@/components/Icon";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";
import DateRangePicker from "@/components/admin/DateRangePicker";

const analyticsSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>`;

const MetricCard = ({
  title,
  value,
  change,
  isPositive,
  subtext,
}: {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
}) => (
  <div className="bg-white rounded-2xl p-6 border border-[#e6e6e6] shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-sm font-medium text-[#606060] uppercase tracking-wide">
        {title}
      </h3>
      {change && (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-[#303030]">{value}</div>
      {subtext && <div className="text-xs text-[#a0a0a0] mt-1">{subtext}</div>}
    </div>
  </div>
);

const Analytics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Mock Data for AreaChart
  const hourlyData = [
    { time: "00:00", value: 1200 },
    { time: "02:00", value: 1500 },
    { time: "04:00", value: 800 },
    { time: "06:00", value: 2200 },
    { time: "08:00", value: 3500 },
    { time: "10:00", value: 2800 },
    { time: "12:00", value: 4200 },
    { time: "14:00", value: 3800 },
    { time: "16:00", value: 5100 },
    { time: "18:00", value: 4500 },
    { time: "20:00", value: 3200 },
    { time: "22:00", value: 2800 },
  ];

  const totalSales24h = hourlyData.reduce((acc, curr) => acc + curr.value, 0);

  // Mock Data for BarChart (Layout vertical for breakdown)
  const salesBreakdown = [
    { name: "Sneakers", value: 15400 },
    { name: "Jakker", value: 12200 },
    { name: "Hættetrøjer", value: 8500 },
    { name: "Skjorter", value: 6200 },
    { name: "Bukser", value: 4100 },
  ];

  return (
    <div className="container mx-auto px-3 pt-8 min-h-screen relative pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-[#303030]">
          <Icon
            src={analyticsSvg}
            className="h-[1.5rem] w-[1.5rem]"
            strokeWidth={2}
          />
          <h1 className="text-[1.5rem] font-bold">Analytics</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-8">
        <button className="bg-[#303030] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-[#1a1a1a] transition-colors">
          I dag
        </button>
        <DateRangePicker 
            startDate={startDate} 
            endDate={endDate} 
            onRangeChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
            }} 
        />
        <button className="bg-white border border-[#c7c7c7] text-[#303030] px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-[#f9f9f9] transition-colors cursor-default">
          DKK kr.
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Row 1 */}
        <MetricCard
          title="Bruttosalg"
          value="45.200 kr."
          change="12%"
          isPositive={true}
          subtext="Sammenlignet med i går"
        />
        <MetricCard
          title="Returnerede Produkter Rate"
          value="2.4%"
          change="-0.5%"
          isPositive={true}
          subtext="Af samlede ordrer"
        />
        <MetricCard
          title="Ordre Gennemført"
          value="42"
          change="8"
          isPositive={true}
          subtext="Afsendt i dag"
        />
        <MetricCard title="Ordrer" value="56" subtext="Modtaget i dag" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Row 2 - Total Sales Over Time (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e6e6e6] shadow-sm">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-base font-bold text-[#303030]">
                Totale salg over tid
              </h3>
              <span className="text-xs text-gray-400">I dag</span>
            </div>
            <p className="text-2xl font-bold text-[#303030]">
              {totalSales24h.toLocaleString("da-DK")} kr.
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={hourlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1c1c1c" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1c1c1c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e0e0e0" />
                <ReferenceLine y={2000} stroke="#e0e0e0" strokeDasharray="3 3" />
                <ReferenceLine y={4000} stroke="#e0e0e0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickFormatter={(value: number) => `${value} kr.`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#303030", fontWeight: "bold" }}
                  formatter={(value: any) => [`${value} kr.`, "Salg"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1c1c1c"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2 - Breakdown (Span 1) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-[#e6e6e6] shadow-sm">
          <h3 className="text-base font-bold text-[#303030] mb-6">
            Totale salg breakdown
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={salesBreakdown}
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="#e0e0e0" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                  formatter={(value: any) => [`${value} kr.`, "Salg"]}
                />
                <Bar
                  dataKey="value"
                  fill="#1c1c1c"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
