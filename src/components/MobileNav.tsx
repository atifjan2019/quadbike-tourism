"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export type MobileNavItem = {
  label: string;
  href: string;
  active?: boolean;
  children?: { label: string; href: string }[];
};

export default function MobileNav({ items }: { items: MobileNavItem[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <button
        className="inline-flex items-center justify-center w-11 h-11 rounded-md text-brand-dark"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-full border-t border-black/5 bg-white">
          <div className="container-site py-4 flex flex-col gap-1">
            {items.map((item) => (
              <div key={item.label}>
                <div className="flex items-stretch gap-1">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex-1 px-4 py-3 rounded-[5px] text-[15px] font-bold uppercase tracking-wide ${
                      item.active
                        ? "bg-brand-yellow text-brand-dark"
                        : "text-brand-dark hover:bg-brand-cream"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <button
                      type="button"
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={() =>
                        setExpanded((cur) => (cur === item.label ? null : item.label))
                      }
                      className="inline-flex items-center justify-center w-12 rounded-[5px] text-brand-dark hover:bg-brand-cream"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expanded === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
                {item.children && expanded === item.label && (
                  <div className="pl-3 pb-2 flex flex-col">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-[14px] font-medium text-brand-dark hover:bg-brand-cream rounded-[5px]"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/tours/"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center bg-brand-dark text-white px-4 py-3 rounded-[5px] text-[14px] font-bold uppercase tracking-wide"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
