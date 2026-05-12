import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const RiderPerformanceChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading } = useQuery({
    queryKey: ["rider-performance"],

    queryFn: async () => {
      const res = await axiosSecure.get("/stats/rider-performance");

      return res.data;
    },
  });

  // loading
  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-2xl p-6 shadow h-95 animate-pulse" />
    );
  }

  // empty state
  if (!data.length) {
    return (
      <div className="bg-base-100 rounded-2xl p-6 shadow h-95 flex items-center justify-center text-gray-400">
        No rider analytics available
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300 h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold">Rider Performance</h3>

        <p className="text-sm text-gray-400 mt-1">
          Top riders based on completed deliveries
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-72.5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />

            {/* X Axis */}
            <XAxis type="number" allowDecimals={false} />

            {/* Y Axis */}
            <YAxis
              type="category"
              dataKey="rider"
              width={120}
              tick={{ fontSize: 11 }}
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value, name) => [
                name === "earnings" ? `৳${value}` : value,

                name === "earnings" ? "Earnings" : "Deliveries",
              ]}
            />

            {/* Bar */}
            <Bar dataKey="deliveries" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiderPerformanceChart;
