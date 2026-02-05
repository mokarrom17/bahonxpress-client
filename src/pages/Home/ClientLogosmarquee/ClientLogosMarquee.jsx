// src/components/ClientSlider.jsx
import React from "react";
import Marquee from "react-fast-marquee";

import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/moonstar.png";
import logo5 from "../../../assets/brands/randstad.png";
import logo6 from "../../../assets/brands/star.png";
import logo7 from "../../../assets/brands/start_people.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const ClientLogosMarquee = () => {
  return (
    <section className="py-16 ">
      <h2 className="text-3xl text-[#03373D] font-extrabold text-center mb-8">
        We've helped thousands of sales teams
      </h2>

      <Marquee speed={50} gradient={false} pauseOnHover={true}>
        {logos.map((logo, index) => (
          <div key={index} className=" mx-24">
            <img
              src={logo}
              alt={`Client Logo ${index + 1}`}
              className="h-6 w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogosMarquee;
