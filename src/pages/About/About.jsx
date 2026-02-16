import React, { useState } from "react";
import Mission from "./Mission";
import Success from "./Success";
import Team from "./Team";
import Story from "./Story";

const About = () => {
  const [activeTab, setActiveTab] = useState("story");

  const tabs = [
    { id: "story", label: "Our Story", component: <Story /> },
    { id: "mission", label: "Our Mission", component: <Mission /> },
    { id: "success", label: "Our Success", component: <Success /> },
    { id: "team", label: "Team & Others", component: <Team /> },
  ];
  const activeContent = tabs.find((tab) => tab.id === activeTab)?.component;
  return (
    <div className="bg-base-100 text-neutral px-6 md:px-12 lg:px-28 py-12 md:py-16 lg:py-20 rounded-2xl shadow-lg space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
          About Us
        </h1>
        <p className="text-gray-500 max-w-157 text-lg">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </div>
      <div className="divider"></div>
      <div className="mt-12">
        <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 text-sm sm:text-base lg:text-lg font-medium transition duration-300
              ${
                activeTab === tab.id
                  ? "text-[#5B6A2E]"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.label}

              {/* Underline Animation */}
              {activeTab === tab.id && (
                <span className="absolute left-0 bottom-0 w-full h-0.75 bg-primary rounded-full transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-8">{activeContent}</div>
      </div>
    </div>
  );
};

export default About;
