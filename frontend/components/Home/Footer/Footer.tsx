import Image from "next/image";
import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-14 mt-20">
      <div className="w-[90%] md:w-[80%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LOGO + NAME */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
            <Image
              src="/images/dgdlogo.jpg"
              alt="Church Logo"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider">
            DIVINE GRACE & DELIVERANCE
            <br />
            MINISTRIES
          </h2>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-5">
            <a
              href="https://www.facebook.com/p/Divine-Grace-Deliverance-Ministries-100064815846250/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-white rounded-full hover:bg-white hover:text-blue-950 transition"
            >
              <FaFacebookF size={18} />
            </a>

            <a
              href="https://www.youtube.com/channel/UCNqg6SJHLLnfonmRkPySEeQ"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-white rounded-full hover:bg-white hover:text-blue-950 transition"
            >
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* LOCATION */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-3">LOCATION</h3>
          <p className="leading-relaxed">
            73 Signal Hill <br />
            Mahikeng <br />
            North west <br />
            South Africa
          </p>
          {/* <p className="mt-2 italic opacity-80">
            (Across the street from Audubon County Memorial Hospital)
          </p> */}
        </div>

        {/* SERVICES */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-3">SERVICES</h3>
          <p className="leading-relaxed">Sundays: 10:00 am</p>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="border-t border-white/20 mt-10 pt-5 text-center text-sm opacity-70">
        © {new Date().getFullYear()} DGD Ministries — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
