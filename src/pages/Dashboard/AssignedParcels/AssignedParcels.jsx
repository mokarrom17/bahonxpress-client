import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";

const AssignedParcels = () => {
  const axiosSecure = useAxiosSecure();

  const [filter, setFilter] = useState("all");
  const [selectedParcel, setSelectedParcel] = useState(null);

  // 🔥 Fetch assigned parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assigned-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/assigned");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 🔥 Filter logic
  const filtered =
    filter === "all"
      ? parcels
      : parcels.filter((p) => p.delivery_status === filter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Assigned Parcels</h2>

      {/* 🔥 Filter */}
      <select
        className="select select-bordered mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="rider_assigned">Assigned</option>
        <option value="picked">Picked</option>
        <option value="in_transit">In Transit</option>
        <option value="delivered">Delivered</option>
      </select>

      {/* 🔥 Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking</th>
              <th>Parcel</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Rider</th>
              <th>Cost</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>

                <td className="font-semibold">{parcel.trackingId}</td>

                <td>{parcel.parcelName}</td>

                <td>{parcel.senderName}</td>

                <td>{parcel.receiverName}</td>

                <td>{parcel.riderEmail || "N/A"}</td>

                <td>৳ {parcel.cost?.total}</td>

                {/* Status */}
                <td>
                  <span
                    className={`badge ${
                      parcel.delivery_status === "delivered"
                        ? "badge-success"
                        : parcel.delivery_status === "in_transit"
                          ? "badge-info"
                          : parcel.delivery_status === "picked"
                            ? "badge-accent"
                            : "badge-warning"
                    }`}
                  >
                    {parcel.delivery_status}
                  </span>
                </td>

                {/* 🔥 View Button */}
                <td>
                  <button
                    className="btn btn-xs btn-outline btn-primary text-black"
                    onClick={() => setSelectedParcel(parcel)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center mt-6 text-gray-500">No parcels found</p>
        )}
      </div>

      {/* 🔥 Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg">
            <h3 className="text-xl font-bold mb-4">Parcel Details</h3>

            <div className="space-y-2 text-sm">
              <p>
                <b>Tracking:</b> {selectedParcel.trackingId}
              </p>
              <p>
                <b>Parcel:</b> {selectedParcel.parcelName}
              </p>

              <p>
                <b>Sender:</b> {selectedParcel.senderName}
              </p>
              <p>
                <b>Sender Phone:</b> {selectedParcel.senderPhone}
              </p>

              <p>
                <b>Receiver:</b> {selectedParcel.receiverName}
              </p>
              <p>
                <b>Receiver Phone:</b> {selectedParcel.receiverPhone}
              </p>
              <p>
                <b>Address:</b> {selectedParcel.receiverAddress}
              </p>

              <p>
                <b>District:</b> {selectedParcel.senderDistrict} →{" "}
                {selectedParcel.receiverDistrict}
              </p>

              <p>
                <b>Cost:</b> ৳ {selectedParcel.cost?.total}
              </p>

              <p>
                <b>Status:</b> {selectedParcel.delivery_status}
              </p>

              <p>
                <b>Rider:</b> {selectedParcel.riderEmail || "Not assigned"}
              </p>

              <p>
                <b>Created:</b>{" "}
                {new Date(selectedParcel.createdAt).toLocaleString()}
              </p>

              {/* 🔥 Optional earning */}
              {selectedParcel.earning && (
                <p>
                  <b>Earning:</b> ৳ {selectedParcel.earning}
                </p>
              )}
            </div>

            {/* Close */}
            <div className="mt-4 text-right">
              <button
                className="btn btn-sm"
                onClick={() => setSelectedParcel(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedParcels;
