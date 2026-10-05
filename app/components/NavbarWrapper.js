// components/NavbarWrapper.js
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function NavbarWrapper() {
  const pathname = usePathname();
  
  // Admin has its own sidebar layout — skip the top navbar there
  if (pathname?.startsWith("/admin")) return null;
  
  return <Navbar />;
}