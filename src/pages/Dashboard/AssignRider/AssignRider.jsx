import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);

  // 🔥 Load riders based on sender district
  const { data: riders = [] } = useQuery({
    queryKey: ["available-riders", selectedParcel?.senderDistrict],
    enabled: !!selectedParcel?.senderDistrict,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/available?district=${selectedParcel.senderDistrict}`,
      );
      return res.data;
    },
  });

  // 🔥 Load parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assign-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/pending");
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

  // 🔥 Handle Assign API
  const handleAssign = async () => {
    try {
      const parcelId = selectedParcel?._id;
      const riderId = selectedRider?._id;

      if (!parcelId || !riderId) return;

      const res = await axiosSecure.patch(`/parcels/assign-rider/${parcelId}`, {
        riderId,
        riderEmail: selectedRider.userEmail,
      });

      // ✅ FIXED CONDITION
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Rider Assigned Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        document.getElementById("assign_modal").close();

        setSelectedParcel(null);
        setSelectedRider(null);

        queryClient.invalidateQueries(["assign-parcels"]);
        queryClient.invalidateQueries(["assigned-parcels"]);
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to assign rider", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Assign Rider</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Parcel</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>From</th>
              <th>To</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td className="font-semibold text-black">
                  {parcel.trackingId}
                </td>
                <td>{parcel.parcelName}</td>
                <td>{parcel.senderName}</td>
                <td>{parcel.receiverName}</td>
                <td>{parcel.senderWarehouse}</td>
                <td>{parcel.receiverWarehouse}</td>
                <td>৳ {parcel.cost?.total}</td>

                <td>
                  <span
                    className={`badge ${
                      parcel.delivery_status === "rider_assigned"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {parcel.delivery_status}
                  </span>
                </td>

                <td>
                  {/* 🔥 OPEN MODAL */}
                  <button
                    className="btn btn-sm btn-primary text-black"
                    onClick={(e) => {
                      e.currentTarget.blur();

                      setSelectedParcel(parcel);
                      setSelectedRider(null);

                      const modal = document.getElementById("assign_modal");
                      modal.showModal();
                    }}
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔥 MODAL */}
        <dialog id="assign_modal" className="modal">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">
              Assign Pickup Rider for: {selectedParcel?.trackingId}
            </h3>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Bike Info</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {riders.map((rider, index) => (
                    <tr
                      key={rider._id}
                      className={
                        selectedRider?._id === rider._id ? "bg-green-100" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{rider.name || rider.userEmail}</td>
                      <td>{rider.phone || "N/A"}</td>
                      <td>{rider.bikeReg || "N/A"}</td>

                      <td>
                        <button
                          className={`btn btn-sm ${
                            selectedRider?._id === rider._id
                              ? "btn-success"
                              : "btn-outline"
                          }`}
                          onClick={() => setSelectedRider(rider)}
                        >
                          {selectedRider?._id === rider._id
                            ? "Selected"
                            : "Select"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {riders.length === 0 && (
              <p className="text-red-500 mt-3">
                No riders available for this district
              </p>
            )}

            {/* 🔥 FOOTER */}
            <div className="flex justify-between mt-6">
              <button
                className="btn"
                onClick={() => {
                  setSelectedParcel(null);
                  setSelectedRider(null);
                  document.getElementById("assign_modal").close();
                }}
              >
                Close
              </button>

              <button
                className="btn btn-primary text-black"
                disabled={!selectedRider || !selectedParcel}
                onClick={handleAssign}
              >
                Confirm Assign
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AssignRider;
