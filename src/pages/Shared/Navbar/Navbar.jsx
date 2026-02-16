import React from "react";
import { Link } from "react-router";
import BahonXpressLogo from "../BahonXpressLogo/BahonXpressLogo";

const Navbar = () => {
  const navItems = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About Us</Link>
      </li>
      <li>
        <Link to="/coverage">Coverage</Link>
      </li>
      <li>
        <Link to="/send-parcel">Send Parcel</Link>
      </li>
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm mb-12">
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
        <Link
          to="/login"
          className="btn px-8 py-4 btn-primary text-accent text-lg  font-bold"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
