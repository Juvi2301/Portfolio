import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Play } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pritheeve | Portfolio",
  description: "I'm Pritheeve, a Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="bg-gradients"></div>
        
        <div className="nav-wrapper">
          <nav className="nav-container">
            <a href="/" className="nav-logo">
              <span className="blue">Prith</span>
              <span className="grey">eeve</span>
            </a>
            
            <ul className="nav-links">
              <li><a href="#" className="active">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Block</a></li>
              <li><a href="#">Pages</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
            
            <a href="#contact" className="btn-hire">
              Hire me <Play size={10} fill="currentColor" style={{ marginLeft: '4px' }} />
            </a>
          </nav>
        </div>

        {children}
      </body>
    </html>
  );
}
