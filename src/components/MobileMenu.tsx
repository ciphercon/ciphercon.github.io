"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="text-xs font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent sm:hidden"
        >
          Menu
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.2s_ease-out] data-[state=closed]:animate-[fade-out_0.2s_ease-in]" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col items-start justify-center gap-8 px-8">
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          {LINKS.map((link) => (
            <Dialog.Close asChild key={link.href}>
              <a
                href={link.href}
                className="text-4xl font-semibold tracking-tight transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </Dialog.Close>
          ))}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-8 top-6 text-xs font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent"
            >
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
