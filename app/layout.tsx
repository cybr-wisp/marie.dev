import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import type { ReactNode } from "react";

import { Header } from "@/components/chrome/Header";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { PreferencesBoot } from "@/components/controls/PreferencesBoot";
import { siteConfig } from "@/lib/site";

import "./globals.css";
import "./editorial.css";
import "./homepage.css";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "marie.dev",
    template: "%s - marie.dev",
  },
  description: siteConfig.description,
  applicationName: "marie.dev",
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-language="en"
      suppressHydrationWarning
      className={atkinson.variable}
    >
      <body
        id="top"
        className="editorial-site"
      >
        <PreferencesBoot />

        <CustomCursor />

        <a
          className="skip-link editorial-skip-link"
          href="#main-content"
        >
          Skip to content
        </a>

        <Header />

        {children}
      </body>
    </html>
  );
}
