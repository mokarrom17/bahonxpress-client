import React from "react";
import logo from "../../../assets/logo.png";

const BahonXpressLogo = () => {
  return (
    <div className="flex items-end">
      <img src={logo} alt="" />
      <p className="text-2xl -ml-3 font-extrabold">BahonXpress</p>
    </div>
  );
};

export default BahonXpressLogo;
