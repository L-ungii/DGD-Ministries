import React from "react";
import Hero from "./Hero/Hero";
import Poster from "./Poster";
import Services from "./Services/Services";
import Calendar from "./Calendar";
import GalleryPreview from "./GalleryPreview";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Poster />
      <Calendar />
      <Services />
      <GalleryPreview />
    </div>
  );
};

export default Home;
