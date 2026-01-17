import React from "react";
import Hero from "./Hero/Hero";
import Services from "./Services/Services";
import Calendar from "./Calendar";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Calendar />
      <Services />
    </div>
  );
};

export default Home;
