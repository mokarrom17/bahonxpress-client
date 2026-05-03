import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { FaMotorcycle } from "react-icons/fa";

const ActiveRidersList = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data = [], isLoading } = useQuery({
    queryKey: ["active-riders"],
    queryFn: () => axiosSecure.get("/riders/active").then((r) => r.data),
  });

  const riders = data.slice(0, 6);

  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-xl p-6 shadow space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse bg-base-200 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">🏍️ Active Riders</h3>
        <button
          onClick={() => navigate("/dashboard/active-riders")}
          className="btn btn-xs btn-outline"
        >
          See All
        </button>
      </div>

      {riders.length === 0 ? (
        <div className="text-center text-gray-400 py-6">
          <FaMotorcycle className="text-4xl mx-auto mb-2 opacity-30" />
          <p>No active riders</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {riders.map((rider, i) => (
            <li key={rider._id} className="flex items-center gap-3">
              {/* Rank badge */}
              <div className="w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </div>

              {/* Rider photo or fallback */}
              {rider.photoURL ? (
                <img
                  src={rider.photoURL}
                  alt={rider.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center shrink-0 text-sm font-bold text-gray-500">
                  {rider.name?.[0]?.toUpperCase() || "R"}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{rider.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {rider.district}
                </p>
              </div>

              <span className="badge badge-success badge-xs">Active</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveRidersList;
