import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";

const AssignedParcels = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("all");

  // 🔥 Fetch assigned parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assigned-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/assigned");
      return res.data;
    },
  });

  // 🔥 Status update function
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/parcels/update-status/${id}`, {
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `Updated to ${newStatus}`,
          timer: 1200,
          showConfirmButton: false,
        });

        queryClient.invalidateQueries(["assigned-parcels"]);
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Update failed", "error");
    }
  };

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
              <th>Action</th>
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

                {/* Rider */}
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

                {/* Action */}
                <td className="space-x-2">
                  {parcel.delivery_status === "rider_assigned" && (
                    <button
                      className="btn btn-xs btn-primary text-black"
                      onClick={() => handleStatusUpdate(parcel._id, "picked")}
                    >
                      Picked
                    </button>
                  )}

                  {parcel.delivery_status === "picked" && (
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() =>
                        handleStatusUpdate(parcel._id, "in_transit")
                      }
                    >
                      Transit
                    </button>
                  )}

                  {parcel.delivery_status === "in_transit" && (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() =>
                        handleStatusUpdate(parcel._id, "delivered")
                      }
                    >
                      Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center mt-6 text-gray-500">No parcels found</p>
        )}
      </div>
    </div>
  );
};

export default AssignedParcels;
