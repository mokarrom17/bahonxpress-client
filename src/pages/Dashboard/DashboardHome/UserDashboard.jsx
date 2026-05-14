import React from "react";
import UserHeader from "./UserDashboardCharts/UserHeader";
import UserStatsCards from "./UserDashboardCharts/UserStatsCards";
import UserRecentParcels from "./UserDashboardCharts/UserRecentParcels";

const UserDashboard = () => {
  return (
    <div className="p-4 md:p-6">
      <UserHeader />
      <UserStatsCards />
      <UserRecentParcels />
    </div>
  );
};

export default UserDashboard;
