import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  if (isPending) {
    return <span className="loading loading-bars loading-xl"></span>;
  }
  const handleDeactivate = async (id) => {
    // 1️⃣ First show confirm dialog BEFORE API call
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This rider will be deactivated!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate!",
    });

    // 2️⃣ Only deactivate if confirmed
    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/riders/deactivate/${id}`);

      if (res.data.modifiedCount > 0) {
        Swal.fire(
          "Deactivated!",
          "Rider moved back to pending list.",
          "success",
        );
        refetch(); // reload table
      }
    }
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      <table className="table w-full border">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Region</th>
            <th>District</th>
            <th>Phone</th>
            <th>Bike</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {riders.map((rider, index) => (
            <tr key={rider._id}>
              <td>{index + 1}</td>
              <td>{rider.userName}</td>
              <td>{rider.region}</td>
              <td>{rider.district}</td>
              <td>{rider.phone}</td>
              <td>{rider.bikeBrand}</td>

              <td>
                <div className="badge badge-success">Approved</div>
              </td>

              <td className="space-x-2">
                {/* View */}
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={() => setSelectedRider(rider)}
                >
                  View
                </button>

                {/* Deactivate */}
                <button
                  className="btn btn-sm btn-warning text-white"
                  onClick={() => handleDeactivate(rider._id)}
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedRider && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="text-2xl font-bold mb-4">Rider Details</h3>

            <p>
              <strong>Name:</strong> {selectedRider.userName}
            </p>
            <p>
              <strong>Email:</strong> {selectedRider.userEmail}
            </p>
            <p>
              <strong>Age:</strong> {selectedRider.age}
            </p>
            <p>
              <strong>Region:</strong> {selectedRider.region}
            </p>
            <p>
              <strong>District:</strong> {selectedRider.district}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRider.phone}
            </p>
            <p>
              <strong>NID:</strong> {selectedRider.nid}
            </p>
            <p>
              <strong>Bike Brand:</strong> {selectedRider.bikeBrand}
            </p>
            <p>
              <strong>Bike Reg:</strong> {selectedRider.bikeReg}
            </p>
            <p>
              <strong>Approved At:</strong>{" "}
              {selectedRider.approvedAt
                ? new Date(selectedRider.approvedAt).toLocaleString()
                : "N/A"}
            </p>

            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedRider(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ActiveRiders;
