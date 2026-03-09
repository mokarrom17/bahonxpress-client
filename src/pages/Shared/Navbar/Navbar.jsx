import React from "react";
import { Link, NavLink } from "react-router";
import BahonXpressLogo from "../BahonXpressLogo/BahonXpressLogo";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const handleLogOut = () => {
    logOut()
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };
  const navItems = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/about">About Us</NavLink>
      </li>
      <li>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>
      <li>
        <NavLink to="/send-parcel">Send Parcel</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </>
      )}
      <li>
        <NavLink to="/beARider">Be A Rider</NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar  sticky top-0 z-50 bg-base-100 shadow-sm mb-12">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <BahonXpressLogo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              {user?.photoURL ? (
                <div className="w-10 rounded-full">
                  <img
                    src={user.photoURL}
                    alt="profile"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-60 p-4 shadow"
            >
              <div className="mb-3">
                <p className="font-bold">{user?.displayName}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <div className="divider my-1"></div>

              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>

              <li>
                <Link to="/dashboard/my-parcels">My Parcels</Link>
              </li>

              <li>
                <Link to="/dashboard/paymentHistory">Payment History</Link>
              </li>

              <div className="divider my-1"></div>

              <li>
                <button onClick={handleLogOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn px-8 py-4 btn-primary text-accent text-lg font-bold"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
