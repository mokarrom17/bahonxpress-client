import React from "react";
import UserHeader from "./UserDashboardCharts/UserHeader";
import UserStatsCards from "./UserDashboardCharts/UserStatsCards";

const UserDashboard = () => {
  return (
    <div className="p-4 md:p-6">
      <UserHeader />
      <UserStatsCards />
    </div>
  );
};

export default UserDashboard;
