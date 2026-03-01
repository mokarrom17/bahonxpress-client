import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  //   load all pending riders
  const {
    isPending,
    data: riders = [],
    refetch,
  } = useQuery({
    queryKey: ["Pending-rider"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });
  if (isPending) {
    return <span className="loading loading-bars loading-xl"></span>;
  }
  //   Approve Rider
  const handleApprove = async (id) => {
    const res = await axiosSecure.patch(`/riders/approve/${id}`);
    if (res.data.modifiedCount > 0) {
      Swal.fire("Approved!", "Rider is now active.", "success");
      refetch();
    }
  };
  // Reject Rider
  const handleReject = async (id) => {
    // 1️⃣ Show confirm dialog BEFORE API call
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This rider application will be rejected!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject!",
    });

    // 2️⃣ Only make API request if confirmed
    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/riders/reject/${id}`);

      if (res.data.modifiedCount > 0) {
        Swal.fire("Rejected!", "Rider application rejected.", "success");
        refetch(); // reload table
      }
    }

    // 3️⃣ If user cancels → do nothing
  };
  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

      <table className="table w-full border">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Region</th>
            <th>District</th>
            <th>Phone</th>
            <th>NID</th>
            <th>Actions</th>
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
              <td>{rider.nid}</td>

              <td className="space-x-2">
                {/* View Button */}
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={() => setSelectedRider(rider)}
                >
                  View
                </button>

                {/* Approve */}
                <button
                  className="btn btn-sm btn-success text-white"
                  onClick={() => handleApprove(rider._id)}
                >
                  Approve
                </button>

                {/* Reject */}
                <button
                  className="btn btn-sm btn-error text-white"
                  onClick={() => handleReject(rider._id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------- MODAL ---------------- */}
      {selectedRider && (
        <dialog id="riderModal" className="modal modal-open">
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
              <strong>Submitted At:</strong>{" "}
              {new Date(selectedRider.submittedAt).toLocaleString()}
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

export default PendingRiders;
