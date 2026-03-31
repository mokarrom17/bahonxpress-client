import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completed-deliveries"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivered");
      return res.data;
    },
  });

  // 🔥 Total earning
  const totalEarning = parcels.reduce((sum, p) => sum + (p.earning || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>

      {/* 🔥 Total Earning Card */}
      <div className="mb-6 p-4 bg-green-100 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-green-700">
          Total Earnings: ৳{totalEarning.toLocaleString()}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking</th>
              <th>Parcel</th>
              <th>Receiver</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date</th>
              <th>Earning</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>

                <td className="font-semibold">{p.trackingId}</td>

                <td>{p.parcelName}</td>

                <td>{p.receiverName}</td>

                {/* 📞 Call */}
                <td>
                  <a
                    href={`tel:${p.receiverPhone}`}
                    className="text-blue-500 hover:underline"
                  >
                    {p.receiverPhone}
                  </a>
                </td>

                {/* 📍 Map */}
                <td>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${p.receiverAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Map
                  </a>
                </td>

                {/* 📅 Date */}
                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>

                {/* 💰 Earning */}
                <td className="text-green-600 font-bold">
                  ৳{(p.earning || 0).toLocaleString()}
                </td>

                {/* Status */}
                <td>
                  <span className="badge badge-success">Delivered</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {parcels.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          No completed deliveries yet
        </p>
      )}
    </div>
  );
};

export default CompletedDeliveries;
