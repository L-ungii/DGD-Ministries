import React from "react";
import Hero from "./Hero/Hero";
import Services from "./Services/Services";
import Calendar from "./Calendar";
import GalleryPreview from "./GalleryPreview";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Calendar />
      <Services />
      <GalleryPreview />
    </div>
  );
};

export default Home;
