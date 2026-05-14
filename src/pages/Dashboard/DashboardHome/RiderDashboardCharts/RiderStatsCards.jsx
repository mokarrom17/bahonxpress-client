import React from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";

const RiderStatsCards = ({ stats }) => {
  const cards = [
    {
      id: 1,
      title: "Assigned Parcels",
      value: stats?.assigned || 0,
      icon: <FaBoxOpen size={24} />,
      bg: "bg-orange-100",
      text: "text-orange-500",
    },

    {
      id: 2,
      title: "Delivered Parcels",
      value: stats?.delivered || 0,
      icon: <FaCheckCircle size={24} />,
      bg: "bg-green-100",
      text: "text-green-500",
    },

    {
      id: 3,
      title: "Pending Earnings",
      value: `৳ ${stats?.pendingEarning || 0}`,
      icon: <FaMoneyBillWave size={24} />,
      bg: "bg-emerald-100",
      text: "text-emerald-500",
    },

    {
      id: 4,
      title: "Cashed Out",
      value: stats?.cashedOut || 0,
      icon: <FaWallet size={24} />,
      bg: "bg-blue-100",
      text: "text-blue-500",
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
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>

              <h3 className="mt-3 text-3xl font-bold text-gray-800">
                {card.value}
              </h3>
            </div>

            <div className={`rounded-2xl p-4 ${card.bg} ${card.text}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiderStatsCards;
