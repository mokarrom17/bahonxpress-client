import React from "react";
import BahonXpressLogo from "../BahonXpressLogo/BahonXpressLogo";
import facebook from "../../../assets/Socialicon/Facebook.png";
import twitter from "../../../assets/Socialicon/twitter-logo-2 3.png";
import linkedin from "../../../assets/Socialicon/linkedin-icon 2.png";
import youtube from "../../../assets/Socialicon/YouTube.png";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center rounded-2xl bg-neutral text-neutral-content p-10 md:px-20 lg:px-32">
      <aside>
        <BahonXpressLogo></BahonXpressLogo>
        <p className="font-bold">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages <br /> to business shipments — we
          deliver on time, every time.
        </p>
      </aside>

      <div className="flex gap-10">
        <a className="link link-hover">Services</a>
        <a className="link link-hover">Coverage</a>
        <a className="link link-hover">About Us</a>
        <a className="link link-hover">Pricing</a>
        <a className="link link-hover">Blog</a>
        <a className="link link-hover">Contact Us</a>
      </div>

      <nav>
        <div className="grid grid-flow-col gap-6">
          <Link>
            <img src={facebook} alt="Facebook" />
          </Link>
          <Link>
            <img src={twitter} alt="Twitter" />
          </Link>
          <Link>
            <img src={linkedin} alt="LinkedIn" />
          </Link>
          <Link>
            <img src={youtube} alt="YouTube" />
          </Link>
        </div>
      </nav>
      <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
    </footer>
  );
};

export default Footer;
