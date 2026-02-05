import React from "react";
import Banner from "../Banner/Banner";
import ServiceSection from "../Services/serviceSection";
import ClientLogosMarquee from "../ClientLogosmarquee/ClientLogosMarquee";
import FeatureSection from "../FeatureSection/FeatureSection";

const Home = () => {
  return (
    <div>
      <Banner />
      <ServiceSection />
      <ClientLogosMarquee />
      <FeatureSection />
    </div>
  );
};

export default Home;
