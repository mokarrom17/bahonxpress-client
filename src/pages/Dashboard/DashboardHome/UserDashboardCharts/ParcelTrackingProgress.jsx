import React from "react";

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const ParcelTrackingProgress = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch Latest Active Parcel
  const { data: parcel = {}, isLoading } = useQuery({
    queryKey: ["latest-active-parcel"],

    queryFn: async () => {
      const res = await axiosSecure.get("/user/latest-active-parcel");

      return res.data;
    },
  });

  // Delivery Steps
  const steps = [
    "pending",
    "rider_assigned",
    "picked",
    "in_transit",
    "delivered",
  ];

  // Current Step Index
  const currentStep = steps.indexOf(parcel?.delivery_status);

  // Loading State
  if (isLoading) {
    return (
      <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
        <span className="loading loading-spinner loading-lg text-sky-500"></span>
      </div>
    );
  }

  // Empty State
  if (!parcel?.trackingId) {
    return (
      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <h3 className="text-2xl font-bold text-gray-800">No Active Parcel</h3>

        <p className="mt-2 text-gray-500">
          You currently have no parcel in delivery progress.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800">
          Parcel Tracking Progress
        </h3>

        <p className="text-sm text-gray-500">
          Latest active parcel tracking status
        </p>
      </div>

      {/* Parcel Info */}
      <div className="mb-10 rounded-2xl bg-sky-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">Tracking ID</p>

            <h4 className="text-xl font-bold text-gray-800">
              {parcel?.trackingId}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">Destination</p>

            <h4 className="text-lg font-semibold text-gray-700">
              {parcel?.receiverDistrict}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">Receiver</p>

            <h4 className="text-lg font-semibold text-gray-700">
              {parcel?.receiverName}
            </h4>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="overflow-x-auto">
        <div className="flex min-w-175 items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 h-1 w-full
                  
                  ${index < currentStep ? "bg-sky-500" : "bg-gray-200"}
                  `}
                ></div>
              )}

              {/* Circle */}
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 text-sm font-bold
                
                ${
                  index <= currentStep
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }
                `}
              >
                {index + 1}
              </div>

              {/* Label */}
              <p
                className={`mt-3 text-center text-sm font-medium capitalize
                
                ${index <= currentStep ? "text-sky-600" : "text-gray-400"}
                `}
              >
                {step.replace("_", " ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParcelTrackingProgress;
