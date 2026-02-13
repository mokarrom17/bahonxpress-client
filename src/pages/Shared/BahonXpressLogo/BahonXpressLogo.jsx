import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

const BahonXpressLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-end">
        <img src={logo} alt="" />
        <p className="text-2xl -ml-3 font-extrabold">BahonXpress</p>
      </div>
    </Link>
  );
};

export default BahonXpressLogo;
