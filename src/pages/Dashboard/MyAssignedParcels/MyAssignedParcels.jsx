import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyAssignedParcels = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 🔥 STATUS CONFIG (clean + scalable)
  const statusConfig = {
    rider_assigned: {
      label: "Rider Assigned",
      class: "badge-warning",
    },
    picked: {
      label: "Picked Up",
      class: "badge-primary text-black",
    },
    in_transit: {
      label: "On the Way",
      class: "badge-info",
    },
    delivered: {
      label: "Delivered",
      class: "badge-success",
    },
  };

  // 🔥 Fetch parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["my-assigned-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/my-assigned");
      return res.data;
    },
  });

  // 🔥 Mutation (with optimistic update)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/parcels/update-status/${id}`, {
        status,
      });
      return res.data;
    },

    // 🔥 Optimistic UI (instant update)
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(["my-assigned-parcels"]);

      const previousData = queryClient.getQueryData(["my-assigned-parcels"]);

      queryClient.setQueryData(["my-assigned-parcels"], (old = []) =>
        old.map((p) => (p._id === id ? { ...p, delivery_status: status } : p)),
      );

      return { previousData };
    },

    onSuccess: (data, variables) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: `Updated to ${variables.status}`,
          timer: 1200,
          showConfirmButton: false,
        });

        queryClient.invalidateQueries(["my-assigned-parcels"]);
      }
    },

    onError: (err, variables, context) => {
      // rollback
      queryClient.setQueryData(["my-assigned-parcels"], context.previousData);

      Swal.fire("Error", "Update failed", "error");
    },
  });

  const handleStatusUpdate = (id, status) => {
    updateStatusMutation.mutate({ id, status });
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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((p, i) => {
              const status = statusConfig[p.delivery_status];

              return (
                <tr key={p._id} className="hover">
                  <td>{i + 1}</td>

                  <td className="font-mono text-sm text-gray-700">
                    {p.trackingId}
                  </td>

                  <td>{p.parcelName}</td>
                  <td>{p.receiverName}</td>

                  <td>
                    <a
                      href={`tel:${p.receiverPhone}`}
                      className="text-blue-600 font-medium"
                    >
                      {p.receiverPhone}
                    </a>
                  </td>

                  <td>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${p.receiverAddress}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      View Map
                    </a>
                  </td>

                  {/* 🔥 STATUS */}
                  <td>
                    <span
                      className={`badge whitespace-nowrap px-3 py-2 ${status?.class}`}
                    >
                      {status?.label}
                    </span>
                  </td>

                  {/* 🔥 ACTION */}
                  <td className="flex items-center gap-2">
                    {p.delivery_status === "rider_assigned" && (
                      <button
                        className="btn btn-xs btn-primary whitespace-nowrap min-w-24"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleStatusUpdate(p._id, "picked")}
                      >
                        📦 Pick
                      </button>
                    )}

                    {p.delivery_status === "picked" && (
                      <button
                        className="btn btn-xs btn-info whitespace-nowrap min-w-24"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleStatusUpdate(p._id, "in_transit")}
                      >
                        🚚 Transit
                      </button>
                    )}

                    {p.delivery_status === "in_transit" && (
                      <button
                        className="btn btn-xs btn-success whitespace-nowrap min-w-24"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleStatusUpdate(p._id, "delivered")}
                      >
                        ✅ Deliver
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {parcels.length === 0 && (
        <p className="text-center mt-6 text-gray-500">No assigned parcels</p>
      )}
    </div>
  );
};

export default MyAssignedParcels;
