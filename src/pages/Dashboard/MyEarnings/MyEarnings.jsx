import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isAfter,
  format,
} from "date-fns";

import {
  Wallet,
  Landmark,
  Coins,
  CalendarDays,
  TrendingUp,
  History,
} from "lucide-react";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const email = user?.email;

  const [activeTab, setActiveTab] = useState("overview");

  // =========================
  // Delivered Parcels Query
  // =========================
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivered");
      return res.data;
    },
  });

  // =========================
  // Cash Out History Query
  // =========================
  const { data: cashOutHistory = [] } = useQuery({
    queryKey: ["cashout-history", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get("/cashout");
      return res.data;
    },
  });

  // =========================
  // Date Setup
  // =========================
  const now = new Date();

  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);

  // =========================
  // Earnings Calculation
  // =========================
  let total = 0;
  let totalCashedOut = 0;
  let totalPending = 0;

  let today = 0;
  let week = 0;
  let month = 0;
  let year = 0;

  parcels.forEach((p) => {
    const earning = p.earning || 0;
    const deliveredAt = new Date(p.updatedAt);

    total += earning;

    if (p.isCashedOut) {
      totalCashedOut += earning;
    } else {
      totalPending += earning;
    }

    if (isAfter(deliveredAt, todayStart)) today += earning;
    if (isAfter(deliveredAt, weekStart)) week += earning;
    if (isAfter(deliveredAt, monthStart)) month += earning;
    if (isAfter(deliveredAt, yearStart)) year += earning;
  });

  // =========================
  // Loading State
  // =========================
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-base-300 rounded-xl"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-base-300"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-base-300"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* =========================
          Header
      ========================= */}
      <div>
        <h2 className="text-3xl font-black text-base-content">My Earnings</h2>

        <p className="text-sm text-gray-500 mt-1">
          Track your delivery income, analytics and cash out history.
        </p>
      </div>

      {/* =========================
          Main Summary Cards
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 blur-3xl"></div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Earnings
              </p>

              <h3 className="text-4xl font-black text-green-600 mt-3">
                ৳{total.toLocaleString()}
              </h3>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <Wallet className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        {/* Cashed Out */}
        <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"></div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Cashed Out</p>

              <h3 className="text-4xl font-black text-blue-600 mt-3">
                ৳{totalCashedOut.toLocaleString()}
              </h3>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Landmark className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-yellow-500/10 blur-3xl"></div>

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Available Balance
              </p>

              <h3 className="text-4xl font-black text-yellow-600 mt-3">
                ৳{totalPending.toLocaleString()}
              </h3>

              <button className="mt-5 btn btn-sm rounded-xl border-0 bg-[#CAEB66] hover:bg-[#b8d95b] text-black shadow-sm">
                ৳ Request Cash Out
              </button>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <Coins className="text-yellow-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Time Analytics
      ========================= */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-primary" />

          <h3 className="text-xl font-bold">Earnings Analytics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              title: "Today",
              amount: today,
            },
            {
              title: "This Week",
              amount: week,
            },
            {
              title: "This Month",
              amount: month,
            },
            {
              title: "This Year",
              amount: year,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-base-300 bg-base-100/80 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{item.title}</p>

                <CalendarDays size={18} className="text-primary" />
              </div>

              <h4 className="text-2xl font-extrabold text-green-700 mt-4">
                ৳{item.amount.toLocaleString()}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          Tabs
      ========================= */}
      <div className="flex items-center gap-3 border-b border-base-300 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "overview" ? "bg-[#CAEB66] text-black" : "bg-base-200"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "history" ? "bg-[#CAEB66] text-black" : "bg-base-200"
          }`}
        >
          Cash Out History
        </button>
      </div>

      {/* =========================
          Overview Tab
      ========================= */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Completed Deliveries</p>

            <h3 className="text-4xl font-black text-primary mt-3">
              {parcels.length}
            </h3>
          </div>

          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Average Per Delivery</p>

            <h3 className="text-4xl font-black text-green-600 mt-3">
              ৳
              {parcels.length
                ? Math.round(total / parcels.length).toLocaleString()
                : 0}
            </h3>
          </div>

          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Last Cash Out Request</p>

            <h3 className="text-xl font-bold text-yellow-600 mt-4">
              {cashOutHistory[0]?.requestedAt
                ? format(new Date(cashOutHistory[0].requestedAt), "dd MMM yyyy")
                : "No History"}
            </h3>
          </div>
        </div>
      )}

      {/* =========================
          Cash Out History Tab
      ========================= */}
      {activeTab === "history" && (
        <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-base-300">
            <History className="text-primary" size={22} />

            <h3 className="text-2xl font-bold">Cash Out History</h3>
          </div>

          {cashOutHistory.length === 0 ? (
            <div className="py-20 text-center">
              <History size={60} className="mx-auto text-gray-300" />

              <h4 className="text-xl font-bold mt-5">No Cash Out History</h4>

              <p className="text-gray-500 mt-2">
                Your future cash out requests will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200">
                  <tr>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Requested Date</th>
                  </tr>
                </thead>

                <tbody>
                  {cashOutHistory.map((item) => (
                    <tr key={item._id} className="hover">
                      <td className="font-bold text-green-600">
                        ৳{item.amount?.toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`badge rounded-full px-4 py-3 text-white border-0 ${
                            item.status === "approved"
                              ? "bg-green-500"
                              : item.status === "rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        >
                          {item.status || "pending"}
                        </span>
                      </td>

                      <td className="text-gray-500">
                        {item.requestedAt
                          ? format(new Date(item.requestedAt), "dd MMM yyyy")
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEarnings;
