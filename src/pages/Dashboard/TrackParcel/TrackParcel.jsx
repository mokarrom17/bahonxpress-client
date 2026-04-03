import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TrackParcel = () => {
  const { trackingId: urlTrackingId } = useParams();
  const [inputId, setInputId] = useState(urlTrackingId || "");
  const axiosSecure = useAxiosSecure();

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["track", inputId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/track/${inputId}`);
      return res.data;
    },
    enabled: false, // 🔥 manual control
  });

  const handleSearch = () => {
    if (inputId) refetch();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Track Your Parcel</h1>

      {/* 🔍 Search Box */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          className="input input-bordered w-full"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* ⏳ Loading */}
      {isPending && <p>Loading...</p>}

      {/* ❌ Error */}
      {isError && <p className="text-red-500">Failed to load tracking data</p>}

      {/* 📦 Parcel Info */}
      {data?.parcel && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow">
          <p>
            <strong>Tracking ID:</strong> {data.parcel.trackingId}
          </p>
          <p>
            <strong>Parcel Name:</strong> {data.parcel.parcelName}
          </p>
          <p className="capitalize">
            <strong>Status:</strong> {data.parcel.delivery_status}
          </p>
        </div>
      )}

      {/* ❌ Empty State */}
      {!data?.parcel && !isPending && !isError && (
        <p className="text-gray-500">No tracking found</p>
      )}

      {/* 📍 Tracking Timeline */}
      {data?.updates?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Tracking Updates</h2>

          <div className="space-y-4">
            {data.updates.map((u) => (
              <div
                key={u._id}
                className="border-l-4 border-green-500 pl-4 py-2"
              >
                <p className="font-bold capitalize">{u.status}</p>
                <p className="text-sm text-gray-600">{u.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(u.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TrackParcel;
