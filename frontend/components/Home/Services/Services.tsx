import { serviceData } from "@/data/data";
import React from "react";
import ServiceCard from "./ServiceCard";

const Services = () => {
  return (
    <div className="pt-20 pb-20">
      <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-16">
        {/* Service card */}
        {serviceData.map((data) => {
          return (
            <div key={data.id}>
              <ServiceCard service={data} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
