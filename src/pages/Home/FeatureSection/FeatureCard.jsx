// src/components/FeatureCard.jsx
import React from "react";

const FeatureCard = ({ feature }) => {
  const { image, title, description } = feature;
  return (
    <div className="bg-base-100 shadow-sm rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full">
      {/* IMAGE LEFT */}
      <div className="w-full md:w-1/3 flex justify-center">
        <img src={image} alt={title} className="h-32 md:h-40 object-contain" />
      </div>

      {/* VERTICAL DIVIDER */}
      <div className="hidden md:block border-l-2 border-dashed border-gray-300 h-24" />

      {/* TEXT RIGHT */}
      <div className="md:w-2/3 text-center md:text-left">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
