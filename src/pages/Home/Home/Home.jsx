import React from "react";
import Banner from "../Banner/Banner";
import ServiceSection from "../Services/serviceSection";
import ClientLogosMarquee from "../ClientLogosmarquee/ClientLogosMarquee";
import FeatureSection from "../FeatureSection/FeatureSection";
import HowItWorks from "../HowItWorks/HowItWorks";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <ServiceSection />
      <ClientLogosMarquee />
      <FeatureSection />
    </div>
  );
};

export default Home;
