import React from "react";

import { useQuery } from "@tanstack/react-query";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const UserStatsCards = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch Dashboard Stats
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["user-dashboard-overview"],

    queryFn: async () => {
      const res = await axiosSecure.get("/user/dashboard-overview");

      return res.data;
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-3xl bg-gray-200"
          ></div>
        ))}
      </div>
    );
  }

  // Cards Data
  const cards = [
    {
      id: 1,
      title: "Total Parcels",
      value: stats?.totalParcels || 0,
      icon: <FaBoxOpen size={24} />,
      bg: "bg-sky-100",
      text: "text-sky-500",
    },

    {
      id: 2,
      title: "Delivered Parcels",
      value: stats?.deliveredParcels || 0,
      icon: <FaCheckCircle size={24} />,
      bg: "bg-green-100",
      text: "text-green-500",
    },

    {
      id: 3,
      title: "Pending Parcels",
      value: stats?.pendingParcels || 0,
      icon: <FaClock size={24} />,
      bg: "bg-orange-100",
      text: "text-orange-500",
    },

    {
      id: 4,
      title: "Total Spending",
      value: `৳ ${stats?.totalSpending?.toLocaleString() || 0}`,
      icon: <FaMoneyBillWave size={24} />,
      bg: "bg-purple-100",
      text: "text-purple-500",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            {/* Text */}
            <div>
              <p className="text-xs font-semibold text-gray-500">
                {card.title}
              </p>

              <h3 className="mt-3 text-2xl font-bold text-gray-800">
                {card.value}
              </h3>
            </div>

            {/* Icon */}
            <div className={`rounded-2xl p-4 ${card.bg} ${card.text}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStatsCards;
