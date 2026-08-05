import Link from "next/link";
import React from "react";
import { FaYoutube, FaFacebookF } from "react-icons/fa";
import { HiOutlineChevronDown } from "react-icons/hi2";

const Hero = () => {
  return (
    <div className="relative w-full h-[100vh] min-h-[600px]">
      {/* video */}
      <video
        src="/images/church-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/church-outside.jpeg"
        className="w-full h-full object-cover"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950/60 to-blue-950/90" />

      {/* text content */}
      <div className="absolute inset-0 z-[100]">
        <div className="flex items-center justify-center flex-col w-full h-full px-4 text-center">
          <p className="text-yellow-300 text-xs sm:text-sm tracking-[0.4em] uppercase mb-4 animate-[fadeInDown_0.8s_ease-out]">
            Divine Grace &amp; Deliverance Ministries
          </p>

          <h1 className="text-[26px] md:text-[42px] lg:text-[56px] tracking-[0.3rem] md:tracking-[0.5rem] text-white font-bold uppercase leading-tight animate-[fadeInUp_0.8s_ease-out]">
            Welcome To Our Church
          </h1>

          <div className="w-24 h-1 bg-yellow-300 my-6 rounded-full animate-[fadeIn_1.2s_ease-out]" />

          <p className="text-white text-lg md:text-xl font-semibold animate-[fadeInUp_1s_ease-out]">
            Sundays at 10:00am
          </p>
          <p className="text-gray-200 text-sm md:text-base mt-1 animate-[fadeInUp_1.1s_ease-out]">
            73 Signal Hill, Mahikeng · Everyone is welcome
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-9 animate-[fadeInUp_1.2s_ease-out]">
            <Link
              href="https://www.youtube.com/channel/UCNqg6SJHLLnfonmRkPySEeQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 md:px-10 md:py-3 px-8 py-2.5 text-white text-base bg-transparent border-2 border-white hover:bg-white hover:text-blue-950 transition-all duration-300 rounded-lg font-medium">
                <FaYoutube size={20} />
                Stream on YouTube
              </button>
            </Link>

            <Link
              href="https://www.facebook.com/p/Divine-Grace-Deliverance-Ministries-100064815846250/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 md:px-10 md:py-3 px-8 py-2.5 text-white text-base bg-transparent border-2 border-white hover:bg-white hover:text-blue-950 transition-all duration-300 rounded-lg font-medium">
                <FaFacebookF size={18} />
                Stream on Facebook
              </button>
            </Link>
          </div>

          <Link
            href="/#events"
            className="mt-10 text-white/70 hover:text-yellow-300 transition-colors animate-[floatSlow_2.5s_ease-in-out_infinite]"
            aria-label="Scroll to events"
          >
            <HiOutlineChevronDown size={34} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
