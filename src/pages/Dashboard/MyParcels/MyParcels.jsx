import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";

import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import TrackingTimeline from "../../../components/TrackingTimeline.jsx";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // 🔥 Tracking toggle state
  const [openId, setOpenId] = useState(null);
  const statusStyle = {
    pending: "bg-yellow-100 text-black border-yellow-300",
    delivered: "bg-green-100 text-green-700 border-green-300",
    in_transit: "bg-blue-100 text-blue-700 border-blue-300",
    picked: "bg-indigo-100 text-indigo-700 border-indigo-300",
    rider_assigned: "bg-purple-100 text-purple-700 border-purple-300",
  };

  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  // 🔥 View toggle
  const handleView = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // 🔥 Payment
  const handlePay = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  // 🔥 Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/parcels/${id}`).then((res) => {
          if (res.data.deletedCount) {
            Swal.fire("Deleted!", "", "success");
            refetch();
          }
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 py-10 ml-2 bg-base-100 shadow rounded-xl">
      <h2 className="text-3xl font-bold mb-6">📦 My Parcels</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-base font-semibold">
              <th>Tracking ID</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Route</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Cost</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No parcel found.
                </td>
              </tr>
            )}

            {parcels.map((p) => (
              <React.Fragment key={p._id}>
                {/* 🔹 MAIN ROW */}
                <tr className={openId === p._id ? "bg-blue-50" : "hover"}>
                  <td className="font-mono text-sm">{p.trackingId}</td>

                  <td className="capitalize">
                    {p.type === "document" ? "📄 Document" : "📦 Parcel"}
                  </td>

                  <td>
                    {p.type === "document" ? "—" : `${p.parcelWeight} kg`}
                  </td>

                  <td>
                    {p.senderWarehouse} → {p.receiverWarehouse}
                  </td>

                  {/* 🔥 DELIVERY STATUS */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyle[p.delivery_status]}`}
                    >
                      {p.delivery_status}
                    </span>
                  </td>

                  {/* 🔥 PAYMENT STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        p.paymentStatus === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {p.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </td>

                  <td>৳{p.cost?.total}</td>

                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>

                  {/* 🔥 ACTIONS */}
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleView(p._id)}
                      className="btn btn-xs btn-outline btn-primary text-black whitespace-nowrap"
                    >
                      {openId === p._id ? "Hide" : "View"}
                    </button>

                    {p.paymentStatus?.toLowerCase() === "unpaid" && (
                      <button
                        onClick={() => handlePay(p._id)}
                        className="btn btn-xs btn-outline whitespace-nowrap"
                      >
                        Pay
                      </button>
                    )}

                    {p.delivery_status === "pending" &&
                      p.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="btn btn-xs btn-error whitespace-nowrap"
                        >
                          ❌ Cancel
                        </button>
                      )}
                  </td>
                </tr>

                {/* 🔥 TRACKING TIMELINE */}
                {openId === p._id && (
                  <tr>
                    <td colSpan="9">
                      <TrackingTimeline trackingId={p.trackingId} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
