// components/Navbar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const isHomePage = pathname === "/";
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!isHomePage) return;
    
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("#nav-list a");

    function handleScroll() {
      let cur = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) cur = s.id;
      });
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + cur);
      });
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#journey", label: "Journey" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 flex items-center justify-between px-8 border-b border-white/[0.06] bg-[#0a0a0a]/95">
        <Link href="/" className="text-cyan bg-gradient-to-r from-cyan to-neon-purple bg-clip-text text-transparent text-xl font-playfair font-bold tracking-wider select-none">
          The Technocrat
        </Link>
        
        {isHomePage && (
          <ul id="nav-list" className="hidden md:flex gap-8 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="nav-link text-white/50 no-underline text-[11px] tracking-widest uppercase hover:text-cyan transition-colors duration-300">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        
        <div className="hidden md:flex gap-6 pl-6 border-l border-white/[0.06] items-center">
          <Link href="/blog" className="text-white/40 no-underline text-[11px] tracking-widest uppercase hover:text-cyan transition-colors duration-300">
            Blog
          </Link>
          
          {!loading && (
            user ? (
              <>
                <Link href="/admin" className="text-white/40 no-underline text-[11px] tracking-widest uppercase hover:text-cyan transition-colors duration-300">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-white/40 text-[11px] tracking-widest uppercase hover:text-cyan transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan to-neon-purple text-white text-[11px] tracking-widest uppercase font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            )
          )}
        </div>
        
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] cursor-none w-10 h-10 p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className={`block w-6 h-px bg-cyan transition-all duration-300 ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`}></span>
          <span className={`block w-6 h-px bg-cyan transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}></span>
          <span className={`block w-6 h-px bg-cyan transition-all duration-300 ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`}></span>
        </button>
      </nav>
      
      <div className={`${mobileOpen ? 'flex' : 'hidden'} md:hidden fixed top-16 left-0 right-0 bottom-0 z-[999] bg-[#0a0a0a] border-b border-white/[0.06] px-6 py-4 flex-col gap-4 overflow-y-auto`}>
        <Link href="/" className="text-cyan bg-gradient-to-r from-cyan to-neon-purple bg-clip-text text-transparent no-underline py-2 border-b border-white/[0.06] block text-base font-playfair font-bold tracking-wider" onClick={() => setMobileOpen(false)}>
          The Technocrat
        </Link>
        {isHomePage && navItems.map((item) => (
          <a key={item.href} href={item.href} className="text-white/60 no-underline py-2 border-b border-white/[0.06] block text-sm" onClick={() => setMobileOpen(false)}>
            {item.label}
          </a>
        ))}
        <div className="border-b border-white/[0.06]"></div>
        <Link href="/blog" className="text-white/60 no-underline py-2 block text-sm" onClick={() => setMobileOpen(false)}>
          Blog
        </Link>
        {!loading && (
          user ? (
            <>
              <Link href="/admin" className="text-white/60 no-underline py-2 block text-sm" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-white/60 no-underline py-2 block text-sm text-left">
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="text-white/60 no-underline py-2 block text-sm" onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          )
        )}
      </div>
    </>
  );
}