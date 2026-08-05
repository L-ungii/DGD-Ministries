"use client";
import { navLinks } from "@/constant/constant";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiBars3BottomRight } from "react-icons/hi2";

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const pathname = usePathname();

  return (
    <div className="fixed w-full h-[12vh] z-[1000] bg-blue-950 shadow-md transition-all duration-200">
      <div className="flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto">
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/dgdlogo.jpg"
              alt="Divine Grace & Deliverance Ministries logo"
              width={48}
              height={48}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-sm sm:text-lg xl:text-xl text-white uppercase font-bold leading-tight">
            DIVINE GRACE &amp; DELIVERANCE
            <br />
            MINISTRIES
          </h1>
        </Link>

        {/* NavLinks */}
        <div className="hidden lg:flex items-center space-x-7 xl:space-x-9">
          {navLinks.map((link) => {
            const active =
              link.url === "/"
                ? pathname === "/"
                : pathname.startsWith(link.url.split("#")[0]) &&
                  link.url !== "/#events";

            return (
              <Link href={link.url} key={link.id}>
                <p
                  className={`
                    relative text-base font-medium w-fit block transition-colors duration-200
                    after:block after:content-[''] after:absolute after:h-[3px]
                    after:bg-yellow-300 after:w-full after:transition after:duration-300 after:origin-right
                    hover:after:scale-x-100 hover:text-yellow-300
                    ${
                      active
                        ? "text-yellow-300 after:scale-x-100"
                        : "text-white after:scale-x-0"
                    }
                  `}
                >
                  {link.label}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Burger Menu */}
        <HiBars3BottomRight
          onClick={openNav}
          aria-label="Open menu"
          className="w-8 h-8 cursor-pointer text-white lg:hidden hover:text-yellow-300 transition-colors"
        />
      </div>
    </div>
  );
};

export default Nav;
