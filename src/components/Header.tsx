"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "On Track", href: "/on-track" },
  { label: "Off Track", href: "/off-track" },
  { label: "Calendar", href: "/calendar" },
];

export default function Header() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference sm:px-10"
    >
      <Link href="/" className="text-sm font-semibold tracking-widest uppercase">
        Your Name
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wide sm:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-foreground/80 transition-colors hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <a
        href="#contact"
        className="text-sm font-semibold uppercase tracking-widest text-accent"
      >
        Contact
      </a>
    </motion.header>
  );
}
