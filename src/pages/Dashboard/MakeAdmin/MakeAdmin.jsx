import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";
import { FiSearch } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";

const MakeAdmin = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const [searchEmail, setSearchEmail] = useState("");
  const [email, setEmail] = useState("");

  // 🔎 Debounce Search
  useEffect(() => {
    const delay = setTimeout(() => {
      setEmail(searchEmail);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchEmail]);

  // 🔎 Search Users
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchUsers", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/search?email=${email}`);
      return res.data;
    },
  });

  // 🔁 Role Update Mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, isAdmin }) => {
      const res = await axiosInstance.patch(`/users/${id}/admin`, {
        isAdmin,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["searchUsers"]);
    },
  });

  // 🔁 Handle Role Change
  const handleRoleChange = async (id, isAdmin) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: isAdmin
        ? "Make this user an admin?"
        : "Remove admin role from this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      roleMutation.mutate(
        { id, isAdmin },
        {
          onSuccess: () => {
            Swal.fire({
              title: "Updated!",
              text: "User role updated successfully.",
              icon: "success",
              timer: 1200,
              showConfirmButton: false,
            });
          },
        },
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Management</h2>
      {/* Search Box */}

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row items-center gap-3 mb-8 max-w-2xl mx-auto"
      >
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search user by email..."
            className="input input-bordered w-96"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary text-black w-full sm:w-auto"
          onClick={() => setEmail(searchEmail)}
        >
          Search
        </button>
      </form>
      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {/* Error */}
      {isError && (
        <p className="text-red-500 text-center">Error searching users</p>
      )}
      {/* No Result */}
      {!isLoading && users.length === 0 && email && (
        <p className="text-center text-gray-500">
          No users found for "<span className="font-semibold">{email}</span>"
        </p>
      )}
      {/* Users Table */}
      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="font-medium">{user.email}</td>

                  <td>
                    <span
                      className={`badge gap-1 ${
                        user.role === "admin"
                          ? "badge-error"
                          : user.role === "rider"
                            ? "badge-info"
                            : "badge-outline"
                      }`}
                    >
                      {user.role === "admin" && <MdAdminPanelSettings />}
                      {user.role || "user"}
                    </span>
                  </td>

                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    {user.role === "admin" ? (
                      <button
                        className="btn btn-error btn-sm flex items-center gap-2"
                        disabled={roleMutation.isPending}
                        onClick={() => handleRoleChange(user._id, false)}
                      >
                        <MdAdminPanelSettings className="text-lg" />
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm flex items-center gap-2"
                        disabled={roleMutation.isPending}
                        onClick={() => handleRoleChange(user._id, true)}
                      >
                        {roleMutation.isPending ? (
                          "Updating..."
                        ) : (
                          <>
                            <FaUserShield className="text-lg" />
                            Make Admin
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
