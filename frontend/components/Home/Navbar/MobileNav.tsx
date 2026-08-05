"use client";
import { navLinks } from "@/constant/constant";
import Link from "next/link";
import React, { useEffect } from "react";
import { CgClose } from "react-icons/cg";

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ closeNav, showNav }: Props) => {
  // Stop the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    document.body.style.overflow = showNav ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showNav]);

  // Close on Escape.
  useEffect(() => {
    if (!showNav) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeNav();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showNav, closeNav]);

  return (
    <div>
      {/* overlay */}
      <div
        onClick={closeNav}
        className={`fixed inset-0 transform transition-all duration-500 z-[1002] bg-black w-full h-screen ${
          showNav
            ? "opacity-70 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* nav links */}
      <div
        className={`text-white fixed top-0 left-0 justify-center flex flex-col h-full transform transition-transform duration-500 w-[80%] sm:w-[60%] bg-blue-950 space-y-6 z-[1050] ${
          showNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navLinks.map((link, i) => (
          <Link href={link.url} key={link.id} onClick={closeNav}>
            <p
              style={{ transitionDelay: showNav ? `${i * 60 + 200}ms` : "0ms" }}
              className={`text-white w-fit text-[20px] ml-12 border-b-[1.5px] p-1 border-white sm:text-[26px] hover:text-yellow-300 hover:border-yellow-300 transition-all duration-300 ${
                showNav ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              }`}
            >
              {link.label}
            </p>
          </Link>
        ))}

        {/* close button */}
        <CgClose
          onClick={closeNav}
          aria-label="Close menu"
          className="absolute top-[0.7rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6 cursor-pointer hover:text-yellow-300 transition-colors"
        />
      </div>
    </div>
  );
};

export default MobileNav;
