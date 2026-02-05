// src/components/HowItWorks.jsx
import React from "react";
import { FaTruckPickup, FaBuilding } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { GiDeliveryDrone } from "react-icons/gi";

const HowItWorks = () => {
  const steps = [
    {
      icon: FaTruckPickup,
      title: "Booking Pick & Drop",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      icon: MdDeliveryDining,
      title: "Cash On Delivery",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      icon: GiDeliveryDrone,
      title: "Delivery Hub",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      icon: FaBuilding,
      title: "Booking SME & Corporate",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
  ];

  return (
    <section className="py-16 px-12 bg-base-200">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-8">How it Works</h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-base-100 rounded-xl shadow-sm p-6 text-center border hover:shadow-md transition"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <step.icon className="text-primary text-4xl" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
