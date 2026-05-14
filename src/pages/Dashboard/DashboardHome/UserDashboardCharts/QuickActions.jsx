import React from "react";

import {
  FaBoxOpen,
  FaLocationArrow,
  FaUserEdit,
  FaShippingFast,
} from "react-icons/fa";

import { Link } from "react-router";

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: "Create Parcel",
      description: "Create and send a new parcel quickly",

      icon: <FaShippingFast size={26} />,

      link: "/send-parcel",

      bg: "bg-sky-100",
      text: "text-sky-500",
    },

    {
      id: 2,
      title: "Track Parcel",
      description: "Track parcel delivery progress",

      icon: <FaLocationArrow size={26} />,

      link: "/dashboard/track",

      bg: "bg-orange-100",
      text: "text-orange-500",
    },

    {
      id: 3,
      title: "My Parcels",
      description: "View and manage your parcels",

      icon: <FaBoxOpen size={26} />,

      link: "/dashboard/my-parcels",

      bg: "bg-green-100",
      text: "text-green-500",
    },

    {
      id: 4,
      title: "Update Profile",
      description: "Manage your account information",

      icon: <FaUserEdit size={26} />,

      link: "/dashboard/profile",

      bg: "bg-purple-100",
      text: "text-purple-500",
    },
  ];

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Quick Actions</h3>

        <p className="text-sm text-gray-500">
          Quickly access your important actions
        </p>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.link}
            className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Icon */}
            <div
              className={`mb-5 inline-flex rounded-2xl p-4 ${action.bg} ${action.text}`}
            >
              {action.icon}
            </div>

            {/* Content */}
            <h4 className="text-xl font-bold text-gray-800 transition group-hover:text-sky-500">
              {action.title}
            </h4>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
