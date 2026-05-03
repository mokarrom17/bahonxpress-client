import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 border border-base-200 rounded-xl shadow px-4 py-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-emerald-600 font-bold">
          ৳ {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueBarChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading } = useQuery({
    queryKey: ["revenue-monthly"],
    queryFn: () =>
      axiosSecure.get("/stats/revenue-monthly").then((r) => r.data),
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow h-80 animate-pulse" />
    );
  }

  // Empty state
  if (!data.length) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow text-center text-gray-400 h-80 flex flex-col items-center justify-center gap-2">
        <p className="text-3xl">📊</p>
        <p>কোনো revenue data নেই</p>
      </div>
    );
  }

  // Highest revenue month কে highlight করা
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-base-100 rounded-xl p-6 shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Monthly Revenue</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last 12 months</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-bold text-emerald-600">
            ৳ {data.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />

            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.revenue === maxRevenue ? "#059669" : "#10B981"}
                  opacity={entry.revenue === maxRevenue ? 1 : 0.65}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best month indicator */}
      {data.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          🏆 Best month:{" "}
          <span className="text-emerald-600 font-semibold">
            {data.find((d) => d.revenue === maxRevenue)?.month}
          </span>{" "}
          — ৳{maxRevenue.toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default RevenueBarChart;
