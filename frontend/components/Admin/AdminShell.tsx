"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineSquares2X2,
  HiOutlineCalendarDays,
  HiOutlinePhoto,
  HiOutlineMegaphone,
  HiOutlineHeart,
  HiOutlineArrowRightOnRectangle,
  HiOutlineGlobeAlt,
  HiBars3,
} from "react-icons/hi2";
import { CgClose } from "react-icons/cg";

const links = [
  { href: "/admin", label: "Dashboard", Icon: HiOutlineSquares2X2 },
  { href: "/admin/events", label: "Events", Icon: HiOutlineCalendarDays },
  { href: "/admin/gallery", label: "Gallery", Icon: HiOutlinePhoto },
  {
    href: "/admin/announcements",
    label: "Announcements",
    Icon: HiOutlineMegaphone,
  },
  { href: "/admin/prayers", label: "Prayer Requests", Icon: HiOutlineHeart },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {links.map(({ href, label, Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-white text-blue-950 shadow"
                : "text-blue-100 hover:bg-white/10"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-blue-950 flex-col py-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-6 mb-8">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shrink-0">
            <Image
              src="/images/dgdlogo.jpg"
              alt="DGD"
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight">
              DGD Admin
            </p>
            <p className="text-blue-300 text-[11px] truncate">{email}</p>
          </div>
        </div>

        {nav}

        <div className="mt-auto px-3 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 transition"
          >
            <HiOutlineGlobeAlt size={20} />
            View Website
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-blue-100 hover:bg-red-500/20 hover:text-red-200 transition"
          >
            <HiOutlineArrowRightOnRectangle size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar — mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[1001] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-blue-950 z-[1002] flex flex-col py-6 transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-white"
          aria-label="Close menu"
        >
          <CgClose size={22} />
        </button>
        <div className="px-6 mb-8">
          <p className="text-white font-bold">DGD Admin</p>
          <p className="text-blue-300 text-[11px] truncate">{email}</p>
        </div>
        {nav}
        <div className="mt-auto px-3">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-blue-100 hover:bg-red-500/20 transition"
          >
            <HiOutlineArrowRightOnRectangle size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-[1000] bg-blue-950 text-white px-4 py-4 flex items-center gap-3">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <HiBars3 size={26} />
          </button>
          <span className="font-bold">DGD Admin</span>
        </header>
        <main className="p-4 md:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
