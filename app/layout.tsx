import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { BrandTheme } from "@/components/brand-theme";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "AcoustiQ | Acoustic Panel Configurator",
  description:
    "A white-label acoustic panel configurator and quotation system for commercial acoustic treatment companies.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml"
      }
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen font-sans antialiased`}
      >
        <BrandTheme />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
