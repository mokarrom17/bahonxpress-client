import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const COLORS = {
  pending: "#facc15", // yellow
  rider_assigned: "#60a5fa", // blue
  picked: "#38bdf8", // sky
  in_transit: "#a78bfa", // purple
  delivered: "#22c55e", // green
  default: "#9ca3af", // gray
};

const StatusPieChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading } = useQuery({
    queryKey: ["delivery-status-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  // 🔹 Format status text
  const formatLabel = (text) =>
    text.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // 🔹 Chart data optimize
  const chartData = useMemo(
    () =>
      data.map((item) => ({
        name: item.status,
        value: item.count,
      })),
    [data],
  );

  // 🔹 Total count
  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData],
  );

  // 🔹 Loading
  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow h-80 animate-pulse" />
    );
  }

  // 🔹 Empty
  if (!chartData.length) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow text-center text-gray-400">
        No data for chart
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl p-6 shadow">
      <h3 className="font-semibold text-lg mb-4">
        Delivery Status Distribution
      </h3>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              minAngle={10}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || COLORS.default}
                />
              ))}
            </Pie>

            {/* 🔹 Tooltip */}
            <Tooltip formatter={(value, name) => [value, formatLabel(name)]} />

            {/* 🔹 Legend */}
            <Legend formatter={(value) => formatLabel(value)} />
            {/* 🔹 Center total */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold text-lg"
            >
              {total}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusPieChart;
