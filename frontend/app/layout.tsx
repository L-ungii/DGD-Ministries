import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import ScrollToTop from "@/components/ScrollToTop";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Divine Grace & Deliverance Ministries",
    template: "%s | DGD Ministries",
  },
  description:
    "Divine Grace & Deliverance Ministries, Mahikeng — Sunday services at 10:00am. Watch sermons, browse our gallery, join our events and send us a prayer request.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <SiteChrome>{children}</SiteChrome>
        <ScrollToTop />
      </body>
    </html>
  );
}
