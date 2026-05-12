import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

/* --------------------------------------------------
   Custom Tooltip
-------------------------------------------------- */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-base-100 border border-base-200 rounded-2xl shadow-xl px-4 py-3 text-sm min-w-44">
      <p className="font-semibold text-gray-700 mb-3">{label}</p>

      {payload.map((entry) => {
        const isRevenue = entry.dataKey === "revenue";

        const color = isRevenue ? "#10B981" : "#60A5FA";

        return (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-5 mb-2"
          >
            {/* Left */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-block ${
                  isRevenue ? "w-5 h-1.5 rounded-full" : "w-3 h-3 rounded"
                }`}
                style={{ backgroundColor: color }}
              />

              <span className="text-gray-500">
                {isRevenue ? "Revenue" : "Deliveries"}
              </span>
            </div>

            {/* Right */}
            <span className="font-bold" style={{ color }}>
              {isRevenue ? `৳${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* --------------------------------------------------
   Main Component
-------------------------------------------------- */
const DeliveryRevenueChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading } = useQuery({
    queryKey: ["delivery-revenue-monthly"],
    retry: false,
    queryFn: async () => {
      const res = await axiosSecure.get("/stats/delivery-revenue");

      return res.data;
    },
  });

  // Highest revenue month কে highlight করার জন্য
  const highestMonth =
    data.length > 0
      ? data.reduce((max, item) => (item.revenue > max.revenue ? item : max))
      : null;

  /* --------------------------------------------------
     Loading State
  -------------------------------------------------- */
  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-2xl p-6 shadow animate-pulse">
        <div className="h-6 w-52 bg-base-200 rounded mb-6" />

        <div className="h-72 bg-base-200 rounded-2xl" />
      </div>
    );
  }

  /* --------------------------------------------------
     Empty State
  -------------------------------------------------- */
  if (!data.length) {
    return (
      <div className="bg-base-100 rounded-2xl p-6 shadow h-80 flex flex-col items-center justify-center text-gray-400">
        <p className="text-5xl mb-3">📊</p>

        <p className="font-medium">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* --------------------------------------------------
           Header
      -------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
        {/* Left */}
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Delivery vs Revenue
          </h3>

          <p className="text-sm text-gray-400 mt-1">Monthly comparison</p>
        </div>
      </div>

      {/* --------------------------------------------------
           Smart Insight
      -------------------------------------------------- */}
      {highestMonth && (
        <div className="mb-5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <p className="text-sm text-emerald-700">
            🚀 Highest revenue recorded in{" "}
            <span className="font-bold">{highestMonth.month}</span>
            {" — "}
            <span className="font-bold">
              ৳{highestMonth.revenue.toLocaleString()}
            </span>
          </p>
        </div>
      )}

      {/* --------------------------------------------------
           Chart
      -------------------------------------------------- */}
      <div className="w-full h-95">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            {/* Left Y Axis */}
            <YAxis
              yAxisId="left"
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={35}
            />

            {/* Right Y Axis */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(v) =>
                v >= 1000 ? `৳${(v / 1000).toFixed(1)}k` : `৳${v}`
              }
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Deliveries Bar */}
            <Bar
              yAxisId="left"
              dataKey="deliveries"
              fill="#60A5FA"
              radius={[8, 8, 0, 0]}
              barSize={30}
              opacity={0.9}
              animationDuration={1200}
            />

            {/* Revenue Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#10B981",
                strokeWidth: 2,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 6,
                fill: "#10B981",
              }}
              animationDuration={1200}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* --------------------------------------------------
           Manual Legend
      -------------------------------------------------- */}
      <div className="flex items-center justify-center gap-6 pt-2 text-sm">
        {/* Deliveries */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-400 inline-block" />

          <span className="text-gray-500 font-medium">Deliveries</span>
        </div>

        {/* Revenue */}
        <div className="flex items-center gap-2">
          <span className="w-5 h-1.5 rounded-full bg-emerald-500 inline-block" />

          <span className="text-gray-500 font-medium">Revenue (৳)</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRevenueChart;
