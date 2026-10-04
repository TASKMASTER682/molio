// components/Cursor.js
"use client";

import { useEffect } from "react";

export function Cursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;
    let rafId = null;

    const loop = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (cursor) {
        cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
      if (ring) {
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div id="cursor" />
      <div id="cursor-ring" />
    </>
  );
}