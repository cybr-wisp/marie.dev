import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import type { ReactNode } from "react";

import { CustomCursor } from "@/components/chrome/CustomCursor";
import { Header } from "@/components/chrome/Header";
import { PreferencesBoot } from "@/components/controls/PreferencesBoot";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
  default: "marie.dev",
  template: "%s — marie.dev",
  },
  description: siteConfig.description,
  applicationName: "marie.dev",
  authors: [
    {
      name: siteConfig.name,
    },
  ],
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
      className={garamond.variable}
    >
      <body id="top">
        <PreferencesBoot />
        <CustomCursor />

        <a
          className="skip-link"
          href="#main-content"
        >
          Skip to content
        </a>

        <Header />

        <div
          className="site-rule site-rule--top"
          aria-hidden="true"
        />

        <div
          className="site-rule site-rule--bottom"
          aria-hidden="true"
        />

        {children}
      </body>
    </html>
  );
}
