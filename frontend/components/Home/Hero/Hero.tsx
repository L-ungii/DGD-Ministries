import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full h-[120vh] sm:h[100vh]">
      {/* overlayer */}
      <div className="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-70"></div>
      <video
        src="/images/church.mp4"
        autoPlay
        // muted
        loop
        preload="metadata"
        className="w-full h-full object-cover"
      />
      {/* video */}
      {/* <img
        src="/images/church-outside.jpeg"
        className="w-full h-full object-cover"
      /> */}

      {/* text conent */}
      <div className="absolute z-[100] w-full h-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-center flex-col w-full h-full">
          <div>
            <h1 className="text-[25px] mb-4 md:mg-0 text-center md:text-[35px] lg:text-[45px] tracking-[0.7rem] text-white font-bold uppercase">
              WELCOME TO OUR CHURCH
            </h1>
            <p className="text-center text-lg md:text-base text-white font-bold [word=spacing:5px]">
              Sundays at 10:00am
            </p>
          </div>
          <p className="text-center text-lg md:text-base text-white [word=spacing:5px]">
            Watch Online
          </p>
          {/* Buttons */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-4">
            <Link
              href="https://www.youtube.com/channel/UCNqg6SJHLLnfonmRkPySEeQ"
              target="_blank"
            >
              <button
                className="
        md:px-12 md:py-2.5 px-8 py-2 text-white text-base
        bg-transparent border-2 border-white
        hover:bg-white hover:text-black
        transition-all duration-300 rounded-lg
      "
              >
                STREAM ON YOUTUBE
              </button>
            </Link>

            <Link
              href="https://www.facebook.com/p/Divine-Grace-Deliverance-Ministries-100064815846250/"
              target="_blank"
            >
              <button
                className="
        md:px-12 md:py-2.5 px-8 py-2 text-white text-base
        bg-transparent border-2 border-white
        hover:bg-white hover:text-black
        transition-all duration-300 rounded-lg
      "
              >
                STREAM ON FACEBOOK
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
