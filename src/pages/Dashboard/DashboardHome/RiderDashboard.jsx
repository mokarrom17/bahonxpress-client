import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import RiderHeader from "./RiderDashboardCharts/RiderHeader";
import RiderStatsCards from "./RiderDashboardCharts/RiderStatsCards";
import RiderRecentDeliveries from "./RiderDashboardCharts/RiderRecentDeliveries";
import RiderDeliveryChart from "./RiderDashboardCharts/RiderDeliveryChart";
import RiderEarningsChart from "./RiderDashboardCharts/RiderEarningsChart";

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

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RiderDeliveryChart />

        <RiderEarningsChart />
      </div>

      {/* Recent Deliveries */}
      <RiderRecentDeliveries />
    </div>
  );
};

export default RiderDashboard;
