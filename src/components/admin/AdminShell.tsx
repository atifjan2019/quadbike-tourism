"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  FolderTree,
  CalendarCheck,
  Newspaper,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Render bare layout on /admin/login (no shell). Handles both trailing-slash variants.
  if (pathname === "/admin/login" || pathname === "/admin/login/") return <>{children}</>;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-black flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-ink text-white transform lg:transform-none lg:translate-x-0 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:flex lg:flex-col`}
      >
        <div className="h-16 px-5 flex items-center border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-display text-2xl text-brand-yellow leading-none">QB</span>
            <span className="text-white font-extrabold tracking-wide text-sm leading-tight">
              QUAD BIKE
              <br />
              <span className="text-brand-yellow">ADMIN</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${
                  active
                    ? "bg-brand-yellow text-black"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="m-3 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide text-white/80 hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </aside>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-4 sticky top-0 z-20">
          <button
            className="lg:hidden -ml-2 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden lg:block" />
          <div className="text-sm text-black/70">
            Signed in as <span className="font-bold text-black">Admin</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
