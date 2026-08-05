"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiOutlineChevronUp } from "react-icons/hi2";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin") || !visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-[900] w-12 h-12 rounded-full bg-blue-950 text-white shadow-lg grid place-items-center hover:bg-blue-900 hover:-translate-y-1 transition-all duration-300"
    >
      <HiOutlineChevronUp size={22} />
    </button>
  );
}
