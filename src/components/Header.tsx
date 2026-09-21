"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SoundToggle from "./SoundToggle";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
];

export default function Header() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10"
    >
      <Link href="/" className="text-sm font-semibold tracking-widest uppercase">
        Abhishek Singh
      </Link>

      <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-widest sm:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-foreground/80 transition-colors hover:text-accent"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <SoundToggle />
        <MobileMenu />
      </div>
    </motion.header>
  );
}
