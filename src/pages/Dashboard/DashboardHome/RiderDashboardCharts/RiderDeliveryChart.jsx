import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

const RiderDeliveryChart = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch Delivery Chart Data
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["rider-delivery-chart"],

    queryFn: async () => {
      const res = await axiosSecure.get("/rider/delivery-chart");

      return res.data;
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Delivery Overview</h3>

        <p className="text-sm text-gray-500">
          Parcel delivery status analytics
        </p>
      </div>

      {/* Empty State */}
      {!chartData.length ? (
        <div className="flex h-87.5 items-center justify-center">
          <p className="text-gray-400">No delivery data found</p>
        </div>
      ) : (
        <div className="h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RiderDeliveryChart;
