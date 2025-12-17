"use client";
import { navLinks } from "@/constant/constant";
import React from "react";
import Link from "next/link";
import { HiBars3BottomRight } from "react-icons/hi2";

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  return (
    <div className="fixed w-full h-[12vh] z-[1000] bg-blue-950 shadow-md transition-all duration-200">
      <div className="flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto">
        {/* LOGO */}
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
            <img
              src="/images/dgdlogo.jpg"
              alt="Avatar Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-xl md:text-2xl text-white uppercase font-bold">
            DIVINE GRACE & DELIVERANCE
            <br />
            MINISTRIES
          </h1>
        </div>

        {/* NavLinks */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link href={link.url} key={link.id}>
              <p
                className="
                  relative text-white text-base font-medium w-fit block
                  after:block after:content-[''] after:absolute after:h-[3px]
                  after:bg-yellow-300 after:w-full after:scale-x-0
                  hover:after:scale-x-100 after:transition after:duration-300 after:origin-right
                "
              >
                {link.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Burger Menu */}
        <HiBars3BottomRight
          onClick={openNav}
          className="w-8 h-8 cursor-pointer text-white lg:hidden"
        />
      </div>
    </div>
  );
};

export default Nav;
