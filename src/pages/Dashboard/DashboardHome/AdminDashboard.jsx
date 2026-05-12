import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaShippingFast,
  FaUsers,
  FaMotorcycle,
  FaMoneyBillWave,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import StatusPieChart from "./AdminDashboardCharts/StatusPieChart";
import DailyBarChart from "./AdminDashboardCharts/DailyBarChart";
import RevenueBarChart from "./AdminDashboardCharts/RevenueBarChart";
import DeliveryRevenueChart from "./AdminDashboardCharts/Deliveryrevenuechart";

const AdminDashboard = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const axiosSecure = useAxiosSecure();

  // ── Admin overall stats (revenue, users, riders)
  const { data: stats = {} } = useQuery({
    queryKey: ["stats-admin"],
    queryFn: () => axiosSecure.get("/stats/admin").then((r) => r.data),
  });

  // ── Delivery status counts (for filter cards)
  const { data: statusCounts = [], isLoading: loadingStatus } = useQuery({
    queryKey: ["delivery-status-count"],
    queryFn: () =>
      axiosSecure.get("/parcels/delivery/status-count").then((r) => r.data),
  });

  // ── Parcels list
  const { data: parcels = [], isLoading: loadingParcels } = useQuery({
    queryKey: ["parcels", statusFilter],
    queryFn: () =>
      axiosSecure.get(`/parcels?status=${statusFilter}`).then((r) => r.data),
  });

  // ── Client-side search filter (Tracking ID)
  const filteredParcels = useMemo(() => {
    if (!searchQuery.trim()) return parcels;
    return parcels.filter((p) =>
      p.trackingId?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [parcels, searchQuery]);

  // ── Reset showAll when filter/search changes
  const visibleParcels = showAll
    ? filteredParcels
    : filteredParcels.slice(0, 5);

  // ── Status card config
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

  // ── Status badge (table)
  const getStatusBadge = (status) => {
    const map = {
      pending: "badge-warning",
      rider_assigned: "badge-secondary",
      picked: "badge-info",
      in_transit: "badge-primary text-black",
      delivered: "badge-success",
    };
    return map[status] || "badge-ghost";
  };

  return (
    <div className="p-6 space-y-8">
      {/* ── Top Stats Row (revenue / users / riders) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="bg-base-100 rounded-2xl shadow p-5 flex items-center gap-4 border border-base-200">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 text-2xl">
            <FaMoneyBillWave />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">
              ৳{stats?.revenue?.toLocaleString() ?? "—"}
            </p>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-5 flex items-center gap-4 border border-base-200">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-600 text-2xl">
            <FaUsers />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats?.totalUsers ?? "—"}</p>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-5 flex items-center gap-4 border border-base-200">
          <div className="p-3 rounded-xl bg-orange-100 text-orange-600 text-2xl">
            <FaMotorcycle />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Riders</p>
            <p className="text-2xl font-bold">{stats?.totalRiders ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* ── Delivery Status Filter Cards ── */}
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
            {/* statusConfig এর keys দিয়ে fixed 4 card */}
            {Object.entries(statusConfig).map(([status, config]) => {
              // API থেকে count খোঁজো, না পেলে 0
              const count =
                statusCounts.find((s) => s.status === status)?.count || 0;

              return (
                <div
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowAll(false);
                    setSearchQuery("");
                  }}
                  className={`card bg-base-100 shadow-md hover:shadow-xl cursor-pointer transition hover:scale-105 ${
                    statusFilter === status ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="card-body flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{config.label}</p>
                      <h2 className="text-2xl font-bold">{count}</h2>
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

      {/* 
      =========================================
      MAIN ANALYTICS
      ========================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* BIG MAIN CHART */}
        <div className="xl:col-span-8">
          <DeliveryRevenueChart />
        </div>

        {/* PIE CHART */}
        <div className="xl:col-span-4">
          <StatusPieChart />
        </div>
      </div>

      {/* 
      =========================================
        SECONDARY ANALYTICS
      ========================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* DAILY TREND */}
        <DailyBarChart />

        {/* MONTHLY REVENUE */}
        <RevenueBarChart />
      </div>

      {/* ── Parcel Table ── */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Parcels{" "}
          <span className="text-base font-normal text-gray-400">
            ({statusFilter}) — {filteredParcels.length} parcels
          </span>
        </h2>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="🔍 Search by Tracking ID..."
            className="input input-bordered w-full sm:w-72"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAll(false);
            }}
          />

          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setShowAll(false);
              setSearchQuery("");
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="rider_assigned">Assigned</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {loadingParcels ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : filteredParcels.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            {searchQuery
              ? `"${searchQuery}" — No parcels found`
              : "🚫 No parcels found"}
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
                    <tr key={p._id} className="hover">
                      <td className="font-bold font-mono text-sm">
                        {p.trackingId}
                      </td>
                      <td>
                        {p.senderDistrict} → {p.receiverDistrict}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadge(p.delivery_status)}`}
                        >
                          {p.delivery_status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${p.paymentStatus === "paid" ? "badge-success" : "badge-warning"}`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td>৳ {p.cost?.total ?? "—"}</td>
                      <td className="text-xs text-gray-500">
                        {p.riderEmail || "Not Assigned"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* See More / Less */}
            {filteredParcels.length > 5 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="btn btn-sm btn-outline text-black btn-primary"
                >
                  {showAll
                    ? "Show Less ▲"
                    : `See More (${filteredParcels.length - 5} remaining) ▼`}
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
