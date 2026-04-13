// components/Cursor.js
"use client";

import { useEffect } from "react";

export function Cursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function loop() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (cursor) {
        cursor.style.left = mx + "px";
        cursor.style.top = my + "px";
      }
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      requestAnimationFrame(loop);
    }
    loop();
  }, []);

  return (
    <>
      <div id="cursor" />
      <div id="cursor-ring" />
    </>
  );
}