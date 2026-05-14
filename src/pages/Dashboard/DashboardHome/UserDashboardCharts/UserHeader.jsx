import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const UserHeader = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch User Header Data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-header-data"],

    queryFn: async () => {
      const res = await axiosSecure.get("/user/header-data");

      return res.data;
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-62.5 items-center justify-center rounded-3xl bg-white shadow-sm">
        <span className="loading loading-spinner loading-lg text-sky-500"></span>
      </div>
    );
  }

  // First Letter Fallback
  const firstLetter = userData?.name?.charAt(0)?.toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-sky-500 via-cyan-500 to-blue-500 p-6 md:p-8 shadow-xl">
      {/* Background Blur */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

      {/* BX Watermark */}
      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-black text-white/10 md:text-9xl">
        BX
      </h1>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Content */}
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[3px] text-white/80">
            User Dashboard
          </p>

          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Welcome Back 👋
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            Track your parcels, monitor deliveries, and manage your shipping
            activities from your personalized dashboard.
          </p>

          {/* Profile Completion */}
          <div className="mt-6 max-w-xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                Profile Completion
              </p>

              <p className="text-sm font-semibold text-white">
                {userData?.profileCompletion}%
              </p>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{
                  width: `${userData?.profileCompletion}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-white/10 px-5 py-5 backdrop-blur-xl">
          {/* Profile Image */}
          {userData?.photoURL ? (
            <img
              src={userData?.photoURL}
              alt={userData?.name}
              className="h-16 w-16 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 text-2xl font-bold text-white">
              {firstLetter}
            </div>
          )}

          {/* User Info */}
          <div>
            <h3 className="text-xl font-bold text-white">
              {userData?.name || "User Account"}
            </h3>

            <p className="text-sm text-white/70">{userData?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
