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
    <div className="rounded-lg overflow-hidden shadow-lg p-8 text-center bg-white min-h-[420px] flex flex-col items-center justify-between">
      {/* Avatar Image */}
      <div className="w-36 h-36 mx-auto rounded-full overflow-hidden shadow-md group cursor-pointer">
        <Image
          src={service.image}
          alt={service.name}
          width={250}
          height={250}
          className="
            w-full h-full object-cover
            transform group-hover:scale-110
            transition-all duration-300
          "
        />
      </div>

      {/* Content */}
      <div className="mt-5 px-4 flex-1">
        <h1 className="text-2xl font-semibold text-black mb-2">
          {service.name}
        </h1>
        <p className="text-base text-gray-700 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Button */}
      <Link href={service.url} rel="noopener noreferrer">
        <button
          className="
  md:px-12 md:py-2.5 px-8 py-2 text-black text-base
  bg-transparent border-2 border-black
  hover:bg-blue hover:text-black
  transition-all duration-300 rounded-lg
"
        >
          {service.buttonName}
        </button>
      </Link>
    </div>
  );
};

export default ServiceCard;
