// components/AdminSidebar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar({ open = false, onClose = () => {} }) {
  const pathname = usePathname();
  
  const links = [
    { href: "/", label: "Home", icon: "⌂" },
    { href: "/admin", label: "Dashboard", icon: "◫" },
    { href: "/admin/leads", label: "Leads", icon: "◉" },
    { href: "/admin/partners", label: "Partners", icon: "◈" },
    { href: "/admin/payouts", label: "Payouts", icon: "◐" },
    { href: "/admin/projects", label: "Projects", icon: "◫" },
    { href: "/admin/skills", label: "Skills", icon: "◎" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "❝" },
    { href: "/admin/blogs", label: "Blogs", icon: "◉" },
    { href: "/admin/settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-[999] lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-[#0a0a0a] lg:bg-white/[0.04] border-r border-white/[0.08] flex flex-col p-6 z-[1000] transition-transform duration-300 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white border border-white/10 rounded-md"
        >
          ✕
        </button>

        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 no-underline text-sm font-inter mb-4 border border-white/[0.08] hover:bg-cyan/10 hover:text-cyan transition-all"
        >
          <span>⌂</span>
          <span>Home</span>
        </Link>
        
        <nav className="flex flex-col gap-2">
          {links.slice(1).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-sm font-inter transition-all ${
                  isActive 
                    ? 'bg-cyan/10 text-cyan' 
                    : 'text-white/50 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
