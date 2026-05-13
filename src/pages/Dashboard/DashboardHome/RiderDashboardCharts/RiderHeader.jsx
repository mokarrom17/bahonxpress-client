import React from "react";

const RiderHeader = ({ riderData }) => {
  // name first letter
  const firstLetter = riderData?.name?.charAt(0)?.toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 md:p-8 shadow-xl">
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
            Rider Panel
          </p>

          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Welcome Back Rider 👋
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            Manage your assigned deliveries, track your earnings, and monitor
            your performance from one powerful dashboard.
          </p>
        </div>

        {/* Rider Card */}
        <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-white/10 px-5 py-5 backdrop-blur-xl">
          {/* Profile Image */}
          {riderData?.photoURL ? (
            <img
              src={riderData?.photoURL}
              alt={riderData?.name}
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
              {riderData?.name || "Rider Account"}
            </h3>

            <p className="text-sm text-white/70">{riderData?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderHeader;
