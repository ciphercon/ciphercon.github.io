import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Rajdhani } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/chrome/Loader";
import Header from "@/components/chrome/Header";
import ScrollPill from "@/components/chrome/ScrollPill";
import Cursor from "@/components/chrome/Cursor";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Abhishek Singh — Security Researcher",
  description:
    "Security Researcher at Microsoft specializing in threat hunting, detection engineering, and cloud security.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${rajdhani.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <SmoothScroll>
          <Loader />
          <Header />
          <ScrollPill />
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
