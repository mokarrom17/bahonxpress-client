import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { Link } from "react-router";

const RiderRecentDeliveries = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch Recent Deliveries
  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ["rider-recent-deliveries"],

    queryFn: async () => {
      const res = await axiosSecure.get("/rider/recent-deliveries");

      return res.data;
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Recent Deliveries
          </h3>

          <p className="text-sm text-gray-500">
            Latest completed parcel activities
          </p>
        </div>

        <Link
          to="/dashboard/completed-deliveries"
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-gray-600">
              <th>Tracking ID</th>
              <th>Receiver</th>
              <th>Location</th>
              <th>Status</th>
              <th>Earnings</th>
            </tr>
          </thead>

          <tbody>
            {deliveries?.map((delivery) => (
              <tr key={delivery._id}>
                {/* Tracking ID */}
                <td className="font-semibold text-gray-700">
                  {delivery?.trackingId}
                </td>

                {/* Receiver */}
                <td>{delivery?.receiverName}</td>

                {/* Location */}
                <td className="max-w-55 truncate">
                  {delivery?.receiverAddress}
                </td>

                {/* Status */}
                <td>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                    Delivered
                  </span>
                </td>

                {/* Earnings */}
                <td className="font-semibold text-emerald-600">
                  ৳ {delivery?.earning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!deliveries?.length && (
        <div className="py-10 text-center">
          <p className="text-gray-400">No recent deliveries found</p>
        </div>
      )}
    </div>
  );
};

export default RiderRecentDeliveries;
