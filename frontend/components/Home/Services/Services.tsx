import { serviceData } from "@/data/data";
import React from "react";
import ServiceCard from "./ServiceCard";
import Reveal from "@/components/Reveal";

const Services = () => {
  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-blue-900 font-semibold tracking-[0.3em] uppercase text-xs mb-3">
              Get involved
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-blue-950">
              Grow With Us
            </h2>
            <div className="w-20 h-1 bg-yellow-300 mx-auto mt-5 rounded-full" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {serviceData.map((data, i) => (
            <Reveal key={data.id} delay={i * 120} className="h-full">
              <ServiceCard service={data} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
