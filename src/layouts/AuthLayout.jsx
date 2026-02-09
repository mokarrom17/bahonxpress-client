import React from "react";
import { Outlet } from "react-router";
import authImage from "../assets/authImage.png";
import BahonXpressLogo from "../pages/Shared/BahonXpressLogo/BahonXpressLogo";

const AuthLayout = () => {
  return (
    <div>
      <div className="p-12 bg-base-200 h-188.75">
        <BahonXpressLogo />
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="flex-1 bg-[#FAFDF0] justify-center items-center">
            <img src={authImage} className="w-142 h-103.75 object-contain" />
          </div>
          <div className="flex-1">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
