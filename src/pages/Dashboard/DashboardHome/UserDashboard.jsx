import React from "react";
import UserHeader from "./UserDashboardCharts/UserHeader";
import UserStatsCards from "./UserDashboardCharts/UserStatsCards";
import UserRecentParcels from "./UserDashboardCharts/UserRecentParcels";
import QuickActions from "./UserDashboardCharts/QuickActions";

const UserDashboard = () => {
  return (
    <div className="p-4 md:p-6">
      <UserHeader />
      <UserStatsCards />
      <UserRecentParcels />
      <QuickActions />
    </div>
  );
};

export default UserDashboard;
