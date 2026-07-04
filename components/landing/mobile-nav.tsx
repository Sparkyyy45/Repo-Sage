"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { SignInButton } from "@/components/sign-in-button";

const LINKS = [
  { href: "#problem", label: "Why" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed left-0 right-0 top-16 z-50 border-b border-border/30 bg-card/95 backdrop-blur-xl shadow-lg">
            <div className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 pt-2 border-t border-border/40 flex justify-center">
                <SignInButton size="sm" label="Sign in with GitHub" />
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
