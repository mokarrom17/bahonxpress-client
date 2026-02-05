import React from "react";
import Banner from "../Banner/Banner";
import ServiceSection from "../Services/serviceSection";
import ClientLogosMarquee from "../ClientLogosmarquee/ClientLogosMarquee";

const Home = () => {
  return (
    <div>
      <Banner />
      <ServiceSection />
      <ClientLogosMarquee />
    </div>
  );
};

export default Home;
