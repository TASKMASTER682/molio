// app/layout.js
import "./globals.css";
import { GrainOverlay } from "./components/GrainOverlay";
import { Cursor } from "./components/Cursor";
import { NavbarWrapper } from "./components/NavbarWrapper";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  metadataBase: new URL("https://thetechnocrat.com"),
  title: "The Technocrat | Full-Stack Developer for Exam & EdTech Platforms",
  description:
    "Full-stack developer from Srinagar, Kashmir. I build exam and education platforms — Next.js, Node.js, MongoDB — that hold up under real traffic. View case studies.",
  keywords: "The Technocrat, full stack developer, Next.js developer, Node.js, exam platform, EdTech, CBT, Srinagar, Kashmir, portfolio, React",
  openGraph: {
    title: "The Technocrat | Full-Stack Developer for Exam & EdTech Platforms",
    description:
      "I build exam and education platforms that hold up under real traffic. Case studies, client work, and contact.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet" />
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