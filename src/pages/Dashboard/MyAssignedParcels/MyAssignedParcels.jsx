import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyAssignedParcels = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 🔥 Fetch parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["my-assigned-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/my-assigned");
      return res.data;
    },
  });

  // 🔥 Mutation for status update
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/parcels/update-status/${id}`, {
        status,
      });
      return res.data;
    },

    onSuccess: (data, variables) => {
      if (data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `Updated to ${variables.status}`,
          timer: 1200,
          showConfirmButton: false,
        });

        // 🔥 Refresh data
        queryClient.invalidateQueries(["my-assigned-parcels"]);
      }
    },

    onError: () => {
      Swal.fire("Error", "Update failed", "error");
    },
  });

  // 🔥 Handle update
  const handleStatusUpdate = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Assigned Parcels</h2>

      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th>Tracking</th>
            <th>Parcel</th>
            <th>Receiver</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {parcels.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td className="font-semibold">{p.trackingId}</td>
              <td>{p.parcelName}</td>
              <td>{p.receiverName}</td>
              <td>
                <a href={`tel:${p.receiverPhone}`} className="text-blue-500">
                  {p.receiverPhone}
                </a>
              </td>
              <td>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${p.receiverAddress}`}
                  target="_blank"
                  className="text-blue-500"
                >
                  View Map
                </a>
              </td>
              {/* Status */}
              <td>
                <span
                  className={`badge ${
                    p.delivery_status === "delivered"
                      ? "badge-success"
                      : p.delivery_status === "in_transit"
                        ? "badge-info"
                        : p.delivery_status === "picked"
                          ? "badge-accent"
                          : "badge-warning"
                  }`}
                >
                  {p.delivery_status}
                </span>
              </td>

              {/* Action */}
              <td className="space-x-2">
                {p.delivery_status === "rider_assigned" && (
                  <button
                    className="btn btn-xs btn-primary text-black"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => handleStatusUpdate(p._id, "picked")}
                  >
                    Picked
                  </button>
                )}

                {p.delivery_status === "picked" && (
                  <button
                    className="btn btn-xs btn-info"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => handleStatusUpdate(p._id, "in_transit")}
                  >
                    Transit
                  </button>
                )}

                {p.delivery_status === "in_transit" && (
                  <button
                    className="btn btn-xs btn-success"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => handleStatusUpdate(p._id, "delivered")}
                  >
                    Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {parcels.length === 0 && (
        <p className="text-center mt-6 text-gray-500">No assigned parcels</p>
      )}
    </div>
  );
};

export default MyAssignedParcels;
