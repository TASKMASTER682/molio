// app/layout.js
import "./globals.css";
import { GrainOverlay } from "./components/GrainOverlay";
import { Cursor } from "./components/Cursor";
import { NavbarWrapper } from "./components/NavbarWrapper";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "The Technocrat | Developer & UPSC Aspirant",
  description: "Developer & UPSC Aspirant from Srinagar, J&K. Code. Culture. Constitution.",
  keywords: "The Technocrat, developer, full stack, coder, Srinagar, Kashmir, portfolio, UPSC, React",
  openGraph: {
    title: "The Technocrat | Developer & UPSC Aspirant",
    description: "Developer & UPSC Aspirant from Srinagar, J&K",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Oswald:wght@200..700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      </head>
      <body className="antialiased font-inter text-white bg-[#0a0a0a]">
        <AuthProvider>
          <Cursor />
          <GrainOverlay />
          <NavbarWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}