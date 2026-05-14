import React from "react";

import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const UserRecentParcels = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch Recent Parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["user-recent-parcels"],

    queryFn: async () => {
      const res = await axiosSecure.get("/user/recent-parcels");

      return res.data;
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
        <span className="loading loading-spinner loading-lg text-sky-500"></span>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Recent Parcels</h3>

          <p className="text-sm text-gray-500">Latest parcel activities</p>
        </div>

        {/* View All */}
        <Link
          to="/dashboard/my-parcels"
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
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
              <th>Destination</th>
              <th>Status</th>
              <th>Cost</th>
            </tr>
          </thead>

          <tbody>
            {parcels?.map((parcel) => (
              <tr key={parcel._id}>
                {/* Tracking ID */}
                <td className="font-semibold text-gray-700">
                  {parcel?.trackingId}
                </td>

                {/* Receiver */}
                <td>{parcel?.receiverName}</td>

                {/* Destination */}
                <td>{parcel?.receiverDistrict}</td>

                {/* Status */}
                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium
                      
                      ${
                        parcel?.delivery_status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : parcel?.delivery_status === "pending"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-sky-100 text-sky-600"
                      }
                    `}
                  >
                    {parcel?.delivery_status}
                  </span>
                </td>

                {/* Cost */}
                <td className="font-semibold text-sky-600">
                  ৳ {parcel?.cost?.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!parcels?.length && (
        <div className="py-10 text-center">
          <p className="text-gray-400">No recent parcels found</p>
        </div>
      )}
    </div>
  );
};

export default UserRecentParcels;
