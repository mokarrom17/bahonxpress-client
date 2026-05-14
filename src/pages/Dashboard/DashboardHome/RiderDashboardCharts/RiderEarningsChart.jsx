import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const RiderEarningsChart = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch Earnings Chart Data
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["rider-earnings-chart"],

    queryFn: async () => {
      const res = await axiosSecure.get("/rider/earnings-chart");

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
        <h3 className="text-2xl font-bold text-gray-800">Earnings Overview</h3>

        <p className="text-sm text-gray-500">Daily rider earnings analytics</p>
      </div>

      {/* Empty State */}
      {!chartData.length ? (
        <div className="flex h-87.5 items-center justify-center">
          <p className="text-gray-400">No earnings data found</p>
        </div>
      ) : (
        <div className="h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="earningsColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />

                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#f97316"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#earningsColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RiderEarningsChart;
