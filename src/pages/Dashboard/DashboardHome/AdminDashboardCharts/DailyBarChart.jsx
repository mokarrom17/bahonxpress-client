import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const DailyBarChart = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ["daily-trend", user?.email],
    enabled: !loading && !!user,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery-trend");
      return res.data;
    },
  });

  // 🔹 Date format (Apr 27)
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // 🔹 optimize + format
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        shortDate: formatDate(d.date),
      })),
    [data],
  );

  // 🔹 loading skeleton
  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow h-80 animate-pulse" />
    );
  }

  // 🔹 empty state
  if (!chartData.length) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow text-center text-gray-400">
        No data for trend
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl p-6 shadow">
      <h3 className="font-semibold text-lg mb-4">Daily Parcel Trend</h3>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            {/* grid */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X axis */}
            <XAxis dataKey="shortDate" />

            {/* Y axis */}
            <YAxis allowDecimals={false} />

            {/* tooltip */}
            <Tooltip formatter={(value) => [`${value} parcels`, "Count"]} />

            {/* bar */}
            <Bar
              dataKey="total"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]} // rounded top
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyBarChart;
