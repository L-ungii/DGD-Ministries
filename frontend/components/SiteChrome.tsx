"use client";

import { usePathname } from "next/navigation";
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import Footer from "@/components/Home/Footer/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

/**
 * Wraps every page with the public navbar + footer, except the admin
 * dashboard which brings its own chrome.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <ResponsiveNav />
      <AnnouncementBar />
      {children}
      <Footer />
    </>
  );
}
