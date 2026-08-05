import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaYoutube } from "react-icons/fa";

const quickLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/sermon", label: "Sermons" },
  { href: "/quiz", label: "Bible Quiz" },
  { href: "/prayer", label: "Prayer Requests" },
  { href: "/contact", label: "Contact Us" },
];

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-14">
      <div className="w-[90%] md:w-[80%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* LOGO + NAME */}
        <div className="flex flex-col items-center md:items-start md:col-span-2">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
            <Image
              src="/images/dgdlogo.jpg"
              alt="Church Logo"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-center md:text-left">
            DIVINE GRACE &amp; DELIVERANCE
            <br />
            MINISTRIES
          </h2>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-5">
            <a
              href="https://www.facebook.com/p/Divine-Grace-Deliverance-Ministries-100064815846250/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 border border-white rounded-full hover:bg-white hover:text-blue-950 hover:scale-110 transition-all duration-300"
            >
              <FaFacebookF size={18} />
            </a>

            <a
              href="https://www.youtube.com/channel/UCNqg6SJHLLnfonmRkPySEeQ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 border border-white rounded-full hover:bg-white hover:text-blue-950 hover:scale-110 transition-all duration-300"
            >
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-3">EXPLORE</h3>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-yellow-300 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* LOCATION + SERVICES */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-3">VISIT US</h3>
          <p className="leading-relaxed">
            73 Signal Hill <br />
            Mahikeng <br />
            North West <br />
            South Africa
          </p>
          <p className="mt-4">
            <a
              href="tel:+27722462869"
              className="hover:text-yellow-300 transition-colors"
            >
              📞 +27 72 246 2869
            </a>
          </p>
          <p className="mt-3 leading-relaxed">
            <span className="font-semibold">Services</span>
            <br />
            Sundays: 10:00 am
          </p>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="border-t border-white/20 mt-10 pt-5 text-center text-sm opacity-70 w-[90%] md:w-[80%] mx-auto">
        © {new Date().getFullYear()} DGD Ministries — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
