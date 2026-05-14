import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import RiderHeader from "./RiderDashboardCharts/RiderHeader";
import RiderStatsCards from "./RiderDashboardCharts/RiderStatsCards";
import RiderRecentDeliveries from "./RiderDashboardCharts/RiderRecentDeliveries";

const RiderDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["rider-dashboard-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/dashboard-overview");
      return res.data;
    },
  });

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="p-4 md:p-6">
      <RiderHeader riderData={dashboardData?.rider} />

      <RiderStatsCards stats={dashboardData?.stats} />
      {/* Recent Deliveries */}
      <RiderRecentDeliveries />
    </div>
  );
};

export default RiderDashboard;
