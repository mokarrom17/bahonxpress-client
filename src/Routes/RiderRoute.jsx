import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/UseUserRole";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    return <span className="loading loading-bars loading-xl"></span>;
  }
  if (!user || role !== "rider") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }
  return children;
};

export default RiderRoute;
