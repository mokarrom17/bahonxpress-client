import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import RiderHeader from "./RiderDashboardCharts/RiderHeader";

const RiderDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: riderData, isLoading } = useQuery({
    queryKey: ["rider-header"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/header-data");
      return res.data;
    },
  });

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="p-4 md:p-6">
      <RiderHeader riderData={riderData} />
    </div>
  );
};

export default RiderDashboard;
