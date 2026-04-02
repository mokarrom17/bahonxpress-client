import React from "react";
import { NavLink, Outlet } from "react-router";
import BahonXpressLogo from "../pages/Shared/BahonXpressLogo/BahonXpressLogo";
import {
  FaBox,
  FaCheckCircle,
  FaClipboardList,
  FaHome,
  FaMotorcycle,
  FaTruck,
  FaUserShield,
  FaWallet,
} from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import {
  MdPayment,
  MdLocationSearching,
  MdPendingActions,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import useUserRole from "../hooks/UseUserRole";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  console.log("ROLE:", role);
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col ">
          {/* Navbar */}
          <div className="navbar bg-base-300 w-full lg:hidden">
            <div className="flex-none ">
              <label
                htmlFor="my-drawer-2"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
          </div>
          {/* Page content here */}
          <Outlet></Outlet>

          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-48 lg:w-60 p-4">
            {/* Sidebar content here */}
            <BahonXpressLogo />
            <li>
              <NavLink to="/dashboard">
                <FaHome className="inline-block mr-2" /> Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/my-parcels">
                <FaBoxOpen className="inline-block mr-2" /> My Parcels
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/paymentHistory">
                <MdPayment className="inline-block mr-2" /> Payment History
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/track">
                <MdLocationSearching className="inline-block mr-2" /> Track A
                Package
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/profile">
                <CgProfile className="inline-block mr-2" /> Update Profile
              </NavLink>
            </li>
            {/* Rider Menu */}
            {!roleLoading && role === "rider" && (
              <>
                <li>
                  <NavLink to="/dashboard/my-assigned-parcels">
                    <FaBox className="inline-block mr-2" /> My Assigned Parcels
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/completed-deliveries">
                    <FaCheckCircle className="inline-block mr-2" />
                    Completed Deliveries
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/my-earnings">
                    <FaWallet className="inline-block mr-2" />
                    My Earnings
                  </NavLink>
                </li>
              </>
            )}
            {/* Admin Menu */}
            {!roleLoading && role === "admin" && (
              <>
                <li>
                  <NavLink to="/dashboard/assign-rider">
                    <FaTruck className="inline-block mr-2" /> Assign Rider
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/assigned-parcels">
                    <FaClipboardList className="inline-block mr-2" /> Assigned
                    Parcels
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/active-riders">
                    <FaMotorcycle className="inline-block mr-2" /> Active Riders
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/pending-riders">
                    <MdPendingActions className="inline-block mr-2" /> Pending
                    Riders
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/make-admin">
                    <FaUserShield className="inline-block mr-2" /> Make Admin
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
