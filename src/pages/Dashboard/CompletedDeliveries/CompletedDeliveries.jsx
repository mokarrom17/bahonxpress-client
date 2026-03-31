import { QueryClient, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

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
  const totalEarning = parcels
    .filter((p) => !p.isCashedOut)
    .reduce((sum, p) => sum + (p.earning || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleCashOut = async () => {
    try {
      const res = await axiosSecure.post("/cashOut");

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "CashOut Requested",
          text: "Admin will process your payment",
        });

        // 🔥 IMPORTANT: refetch data
        QueryClient.invalidateQueries(["completed-deliveries"]);
      } else {
        Swal.fire("Info", res.data.message, "info");
      }
    } catch {
      Swal.fire("Error", "CashOut failed", "error");
    }
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>

      {/* 🔥 Total Earning Card */}
      <div className="mb-6 flex justify-between items-center p-4 bg-green-100 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-green-700">
          Total Earnings: ৳{totalEarning.toLocaleString()}
        </h3>
        <button
          disabled={totalEarning === 0}
          onClick={handleCashOut}
          className="btn btn-success mt-3"
        >
          CashOut
        </button>
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
