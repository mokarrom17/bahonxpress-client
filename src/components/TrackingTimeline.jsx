import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const TrackingTimeline = ({ trackingId }) => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["track", trackingId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/track/${trackingId}`);
      return res.data;
    },
    enabled: !!trackingId,
  });

  if (isLoading) return <p>Loading...</p>;

  const updates = data?.updates || [];

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Tracking Details</h2>

      <div className="relative border-l-2 border-green-500 ml-4">
        {updates.map((u) => (
          <div key={u._id} className="mb-6 ml-6">
            {/* Circle */}
            <span className="absolute -left-2.5 flex items-center justify-center w-5 h-5 bg-green-500 rounded-full text-white text-xs">
              ✓
            </span>

            {/* Date */}
            <p className="text-xs text-gray-400">
              {new Date(u.updatedAt).toLocaleString()}
            </p>

            {/* Status */}
            <h3 className="font-semibold capitalize">
              {formatStatus(u.status)}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600">{u.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🔥 Helper for better labels
const formatStatus = (status) => {
  const map = {
    pending: "Order Placed",
    paid: "Payment Completed",
    rider_assigned: "Rider Assigned",
    picked: "Picked Up",
    in_transit: "On the Way",
    delivered: "Delivered",
  };

  return map[status] || status;
};

export default TrackingTimeline;
