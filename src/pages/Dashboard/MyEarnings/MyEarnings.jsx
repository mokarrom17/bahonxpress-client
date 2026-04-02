import { useQuery } from "@tanstack/react-query";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isAfter,
} from "date-fns";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/delivered`);
      return res.data;
    },
  });

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);

  let total = 0,
    totalCashedOut = 0,
    totalPending = 0,
    today = 0,
    week = 0,
    month = 0,
    year = 0;

  parcels.forEach((p) => {
    const earning = p.earning || 0;
    const deliveredAt = new Date(p.updatedAt);

    total += earning;

    if (p.isCashedOut) totalCashedOut += earning;
    else totalPending += earning;

    if (isAfter(deliveredAt, todayStart)) today += earning;
    if (isAfter(deliveredAt, weekStart)) week += earning;
    if (isAfter(deliveredAt, monthStart)) month += earning;
    if (isAfter(deliveredAt, yearStart)) year += earning;
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Earnings</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-base-200 p-4 rounded-xl shadow">
              <p className="text-lg font-semibold">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{total.toLocaleString()}
              </p>
            </div>

            <div className="bg-base-200 p-4 rounded-xl shadow">
              <p className="text-lg font-semibold">Cashed Out</p>
              <p className="text-2xl font-bold text-blue-600">
                ৳{totalCashedOut.toLocaleString()}
              </p>
            </div>

            <div className="bg-base-200 p-4 rounded-xl shadow">
              <p className="text-lg font-semibold">Available</p>
              <p className="text-2xl font-bold text-yellow-600">
                ৳{totalPending.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Time analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-xl font-bold text-green-700">
                ৳{today.toLocaleString()}
              </p>
            </div>

            <div className="bg-base-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">This Week</p>
              <p className="text-xl font-bold text-green-700">
                ৳{week.toLocaleString()}
              </p>
            </div>

            <div className="bg-base-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-xl font-bold text-green-700">
                ৳{month.toLocaleString()}
              </p>
            </div>

            <div className="bg-base-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">This Year</p>
              <p className="text-xl font-bold text-green-700">
                ৳{year.toLocaleString()}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyEarnings;
