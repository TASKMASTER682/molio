// app/admin/layout.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setSidebarOpen(false);
  }

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan text-xl font-playfair">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen font-inter">
      {/* Mobile topbar */}
      <header className="lg:hidden sticky top-0 z-[998] h-14 flex items-center gap-3 px-4 bg-[#0a0a0a]/95 border-b border-white/10">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          className="flex flex-col justify-center gap-[5px] w-9 h-9 p-2 -ml-1"
        >
          <span className="block w-5 h-px bg-cyan"></span>
          <span className="block w-5 h-px bg-cyan"></span>
          <span className="block w-5 h-px bg-cyan"></span>
        </button>
        <span className="text-cyan bg-gradient-to-r from-cyan to-neon-purple bg-clip-text text-transparent font-playfair font-bold tracking-wider text-sm">
          The Technocrat — Admin
        </span>
      </header>

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen p-4 md:p-8 w-full max-w-full lg:ml-64 lg:w-[calc(100%-16rem)]">
        {children}
      </div>
    </div>
  );
}
