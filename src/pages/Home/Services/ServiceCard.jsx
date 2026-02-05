// src/components/ServiceCard.jsx
import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div className="card bg-base-100 shadow-md p-8 border hover:shadow-lg hover:bg-[#CAEB66] transition">
      <div className="text-primary flex justify-center text-4xl mb-4">
        <Icon />
      </div>
      <h3 className="text-xl text-blue-500 font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
