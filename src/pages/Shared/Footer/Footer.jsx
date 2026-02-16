import React from "react";
import BahonXpressLogo from "../BahonXpressLogo/BahonXpressLogo";
import facebook from "../../../assets/Socialicon/Facebook.png";
import twitter from "../../../assets/Socialicon/twitter-logo-2 3.png";
import linkedin from "../../../assets/Socialicon/linkedin-icon 2.png";
import youtube from "../../../assets/Socialicon/YouTube.png";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content mt-12 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-28 py-12 space-y-10">
        {/* Logo + Description */}
        <div className="text-center space-y-4">
          <BahonXpressLogo />

          <p className="max-w-150 mx-auto text-sm sm:text-base text-gray-300">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm sm:text-base">
          <Link className="hover:text-primary transition">Services</Link>
          <Link className="hover:text-primary transition">Coverage</Link>
          <Link className="hover:text-primary transition">About Us</Link>
          <Link className="hover:text-primary transition">Pricing</Link>
          <Link className="hover:text-primary transition">Blog</Link>
          <Link className="hover:text-primary transition">Contact Us</Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6">
          <Link>
            <img
              src={facebook}
              alt="Facebook"
              className="w-6 sm:w-7 hover:scale-110 transition"
            />
          </Link>
          <Link>
            <img
              src={twitter}
              alt="Twitter"
              className="w-6 sm:w-7 hover:scale-110 transition"
            />
          </Link>
          <Link>
            <img
              src={linkedin}
              alt="LinkedIn"
              className="w-6 sm:w-7 hover:scale-110 transition"
            />
          </Link>
          <Link>
            <img
              src={youtube}
              alt="YouTube"
              className="w-6 sm:w-7 hover:scale-110 transition"
            />
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400 pt-6 border-t border-gray-700">
          © {new Date().getFullYear()} BahonXpress. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
