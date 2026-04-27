import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaShippingFast,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import StatusPieChart from "./AdminDashboardCharts/StatusPieChart";

const AdminDashboard = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const axiosSecure = useAxiosSecure();

  // 🔹 Fetch status counts
  const { data: statusCounts = [], isLoading: loadingStatus } = useQuery({
    queryKey: ["delivery-status-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  // 🔹 Fetch parcels
  const { data: parcels = [], isLoading: loadingParcels } = useQuery({
    queryKey: ["parcels", statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?status=${statusFilter}`);
      return res.data;
    },
  });

  // 🔹 Status config (card)
  const statusConfig = {
    pending: {
      icon: <FaClock />,
      color: "bg-yellow-100 text-yellow-600",
      label: "Pending",
    },
    rider_assigned: {
      icon: <FaShippingFast />,
      color: "bg-blue-100 text-blue-600",
      label: "Assigned",
    },
    in_transit: {
      icon: <FaTruck />,
      color: "bg-purple-100 text-purple-600",
      label: "In Transit",
    },
    delivered: {
      icon: <FaCheckCircle />,
      color: "bg-green-100 text-green-600",
      label: "Delivered",
    },
  };

  // 🔹 Status badge (table)
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "rider_assigned":
        return "badge-secondary";
      case "picked":
        return "badge-info";
      case "in_transit":
        return "badge-primary text-black";
      case "delivered":
        return "badge-success";
      default:
        return "badge-ghost";
    }
  };

  // 🔹 Show only 5 initially
  const visibleParcels = showAll ? parcels : parcels.slice(0, 5);

  return (
    <div className="p-6 space-y-8">
      {/* 🔥 STATUS CARDS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Delivery Overview</h2>

        {loadingStatus ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card bg-base-200 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusCounts.map((item, index) => {
              const config = statusConfig[item.status] || {
                icon: <FaTruck />,
                color: "bg-gray-100 text-gray-600",
                label: item.status,
              };

              return (
                <div
                  key={index}
                  onClick={() => setStatusFilter(item.status)}
                  className={`card bg-base-100 shadow-md hover:shadow-xl cursor-pointer transition hover:scale-105 ${
                    statusFilter === item.status ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="card-body flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{config.label}</p>
                      <h2 className="text-2xl font-bold">{item.count}</h2>
                      <p className="text-xs text-gray-400">Click to filter</p>
                    </div>

                    <div className={`p-3 rounded-full text-xl ${config.color}`}>
                      {config.icon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* 📊 CHART SECTION */}
      <div className="grid md:grid-cols-2 gap-6">
        <StatusPieChart />
      </div>

      {/* 📦 PARCEL TABLE */}
      <div>
        <h2 className="text-xl font-bold mb-4">Parcels ({statusFilter})</h2>

        {/* 🔍 Search + Filter */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by Tracking ID"
            className="input input-bordered w-64"
          />

          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="rider_assigned">Assigned</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {loadingParcels ? (
          <div className="loading loading-spinner"></div>
        ) : parcels.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            🚫 No parcels found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tracking</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Cost</th>
                    <th>Rider</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleParcels.map((p) => (
                    <tr key={p._id}>
                      <td className="font-bold text-black">{p.trackingId}</td>

                      <td>
                        {p.senderDistrict} → {p.receiverDistrict}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusBadge(
                            p.delivery_status,
                          )}`}
                        >
                          {p.delivery_status}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            p.paymentStatus === "paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>

                      <td>৳ {p.cost?.total}</td>

                      <td>{p.riderEmail || "Not Assigned"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔥 SEE MORE BUTTON */}
            {parcels.length > 5 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="btn btn-sm btn-outline text-black btn-primary"
                >
                  {showAll ? "Show Less" : "See More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
