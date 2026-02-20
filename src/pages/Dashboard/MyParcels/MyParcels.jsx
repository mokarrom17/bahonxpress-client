import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/parcels/${id}`)
          .then((res) => {
            console.log(res.data);
            if (res.data.deleteCount) {
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Parcel has been deleted.",
                timer: 1500,
                showConfirmButton: false,
              });

              // remove from UI without reload
              // setParcels((prev) => prev.filter((p) => p._id !== id));
            }
            refetch();
          })
          .catch(() => {
            Swal.fire("Error", "Failed to delete parcel.", "error");
          });
      }
    });
  };
  console.log(parcels);
  return (
    <div>
      <div className="p-6 bg-base-100 shadow rounded-xl">
        <h2 className="text-3xl font-bold mb-6">📦 My Parcels</h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-base font-semibold">
                <th>Tracking ID</th>
                <th>Type</th>
                <th>Weight</th>
                <th>Route</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Cost</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {parcels.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No parcel found.
                  </td>
                </tr>
              )}

              {parcels.map((p) => (
                <tr key={p._id} className="hover">
                  {/* Tracking */}
                  <td className="font-semibold text-primary">{p.trackingId}</td>

                  {/* Type */}
                  <td className="capitalize">{p.type}</td>

                  {/* Weight */}
                  <td>{p.parcelWeight} kg</td>

                  {/* Route */}
                  <td>
                    {p.senderWarehouse} → {p.receiverWarehouse}
                  </td>

                  {/* Delivery Status */}
                  <td>
                    <div
                      className={`badge ${
                        p.status === "pending"
                          ? "badge-warning"
                          : p.status === "delivered"
                            ? "badge-success"
                            : "badge-info"
                      }`}
                    >
                      {p.status}
                    </div>
                  </td>

                  {/* Payment Status - NEW */}
                  <td>
                    <div
                      className={`badge ${
                        p.paymentStatus === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {p.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </div>
                  </td>

                  {/* Cost */}
                  <td>৳{p.cost?.total}</td>

                  {/* Date */}
                  <td>{new Date(p.createdAt).toLocaleString()}</td>

                  {/* Actions */}
                  <td className="flex gap-2">
                    <button className="btn btn-xs btn-outline text-black btn-primary">
                      Track
                    </button>

                    <button className="btn btn-xs btn-outline">View</button>

                    {p.status === "pending" && (
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="btn btn-xs btn-outline btn-error"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyParcels;
