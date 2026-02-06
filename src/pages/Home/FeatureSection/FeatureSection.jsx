// src/components/FeatureSection.jsx
import React from "react";
import FeatureCard from "./FeatureCard";

// Import your images
import img1 from "../../../assets/live-tracking.png";
import img2 from "../../../assets/tiny-deliveryman.png";
import img3 from "../../../assets/safe-delivery.png";

const features = [
  {
    image: img1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
  },
  {
    image: img2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
  },
  {
    image: img3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns — anytime you need us.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4 space-y-10">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
