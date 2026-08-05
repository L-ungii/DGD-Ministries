import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  service: {
    id: number;
    image: string;
    name: string;
    description: string;
    buttonName: string;
    url: string;
  };
};

const ServiceCard = ({ service }: Props) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 text-center bg-white h-full min-h-[420px] flex flex-col items-center justify-between group">
      {/* Avatar Image */}
      <div className="w-36 h-36 mx-auto rounded-full overflow-hidden shadow-md ring-4 ring-blue-950/5">
        <Image
          src={service.image}
          alt={service.name}
          width={250}
          height={250}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="mt-5 px-2 flex-1">
        <h3 className="text-2xl font-semibold text-blue-950 mb-2">
          {service.name}
        </h3>
        <p className="text-base text-gray-600 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Button */}
      <Link href={service.url} className="mt-6">
        <button className="md:px-10 md:py-2.5 px-8 py-2 text-blue-950 text-base font-medium bg-transparent border-2 border-blue-950 hover:bg-blue-950 hover:text-white transition-all duration-300 rounded-lg">
          {service.buttonName}
        </button>
      </Link>
    </div>
  );
};

export default ServiceCard;
