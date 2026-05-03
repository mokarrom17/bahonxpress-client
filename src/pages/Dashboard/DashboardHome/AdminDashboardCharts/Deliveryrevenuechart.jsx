import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

/* --------------------------------------------------
   Custom Tooltip
-------------------------------------------------- */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow-lg px-4 py-3 text-sm min-w-36">
      <p className="font-semibold text-gray-600 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ background: entry.color }}
          />
          <span className="text-gray-500">
            {entry.dataKey === "revenue" ? "Revenue" : "Deliveries"}:
          </span>
          <span className="font-bold" style={{ color: entry.color }}>
            {entry.dataKey === "revenue"
              ? `৳${entry.value.toLocaleString()}`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* --------------------------------------------------
   Custom Legend
-------------------------------------------------- */
const CustomLegend = () => (
  <div className="flex items-center justify-center gap-6 mt-2 text-sm">
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded bg-blue-400 inline-block" />
      <span className="text-gray-500">Deliveries</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-4 h-1.5 rounded-full bg-emerald-500 inline-block" />
      <span className="text-gray-500">Revenue (৳)</span>
    </div>
  </div>
);

/* --------------------------------------------------
   Main Component
-------------------------------------------------- */
const DeliveryRevenueChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading } = useQuery({
    queryKey: ["delivery-revenue-monthly"],
    queryFn: () =>
      axiosSecure.get("/stats/delivery-revenue").then((r) => r.data),
  });

  // Summary stats
  const totalDeliveries = data.reduce((s, d) => s + (d.deliveries || 0), 0);
  const totalRevenue = data.reduce((s, d) => s + (d.revenue || 0), 0);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow">
        <div className="h-6 w-48 bg-base-200 rounded animate-pulse mb-6" />
        <div className="h-72 bg-base-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  // Empty state
  if (!data.length) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow h-80 flex flex-col items-center justify-center text-gray-400 gap-2">
        <p className="text-3xl">📊</p>
        <p>কোনো data নেই এখনো</p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl p-6 shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg">Delivery vs Revenue</h3>
          <p className="text-xs text-gray-400 mt-0.5">Monthly comparison</p>
        </div>

        {/* Summary badges */}
        <div className="flex gap-3">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-blue-400">Total Deliveries</p>
            <p className="text-lg font-bold text-blue-600">{totalDeliveries}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-emerald-400">Total Revenue</p>
            <p className="text-lg font-bold text-emerald-600">
              ৳{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            {/* Left Y Axis — Deliveries */}
            <YAxis
              yAxisId="left"
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={30}
            />

            {/* Right Y Axis — Revenue */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />

            {/* Bar — Deliveries */}
            <Bar
              yAxisId="left"
              dataKey="deliveries"
              fill="#60A5FA"
              radius={[6, 6, 0, 0]}
              barSize={28}
              opacity={0.85}
            />

            {/* Line — Revenue */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#10B981" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <CustomLegend />
    </div>
  );
};

export default DeliveryRevenueChart;
