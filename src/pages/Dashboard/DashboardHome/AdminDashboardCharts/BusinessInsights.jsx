import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const BusinessInsights = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["business-insights"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stats/business-insights");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-7">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-3xl bg-base-200 h-52 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 p-7">
      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-800">Business Insights</h2>
        <p className="text-sm text-gray-400 mt-1">Key operational highlights</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Card 1 — Best Revenue Month */}
        <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300 min-h-48">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl">
            🚀
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-emerald-600">
              Best Revenue Month
            </p>
            <h3 className="text-sm font-bold text-gray-800 leading-tight">
              {data?.bestRevenueMonth?._id || "N/A"}
            </h3>
            <p className="text-[10px] font-semibold text-emerald-700">
              ৳{data?.bestRevenueMonth?.revenue?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Card 2 — Top Rider */}
        <div className="rounded-3xl bg-blue-50 border border-blue-100 p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300 min-h-48">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-4xl">
            🏆
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-blue-600">Top Rider</p>
            <h3 className="text-lg font-bold text-gray-800 leading-tight truncate">
              {data?.topRider?.name ||
                data?.topRider?.rider ||
                data?.topRider?.email ||
                "No Rider"}
            </h3>
            <p className="text-xs font-light text-blue-700">
              {data?.topRider?.deliveries || 0} deliveries
            </p>
            <p className="text-[10px] font-semibold text-gray-500">
              ৳{data?.topRider?.earnings?.toLocaleString() || 0} earnings
            </p>
          </div>
        </div>

        {/* Card 3 — Most Popular Route */}
        <div className="rounded-3xl bg-orange-50 border border-orange-100 p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300 min-h-48">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-4xl">
            📦
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-orange-600">
              Most Popular Route
            </p>
            <h3 className="text-md font-bold text-gray-800 leading-tight">
              <span>
                {data?.topRoute?._id?.from || "N/A"}
                <span className="text-orange-500 mx-2">→</span>
              </span>
              <br />
              <span>{data?.topRoute?._id?.to || "N/A"}</span>
            </h3>
            <p className="text-[10px] font-semibold text-orange-700">
              {data?.topRoute?.total || 0} parcels
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;
