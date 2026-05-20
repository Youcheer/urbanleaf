import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://urbanleaf.vercel.app"),
  title: "Urban Leaf - Anthurium Plant Nursery Ganemulla",
  description:
    "Discover high-quality, beautiful Anthuriums and garden plants at Urban Leaf in Ganemulla, Gampaha. Island-wide courier delivery available across Sri Lanka. Bring nature home.",
  alternates: {
    canonical: "https://urbanleaf.vercel.app/",
  },
  verification: {
    google: "d16e0b46446fa13f",
  },
  openGraph: {
    type: "website",
    url: "https://urbanleaf.vercel.app/",
    siteName: "Urban Leaf",
    title: "Urban Leaf - Anthurium Plant Nursery Ganemulla",
    description:
      "Discover high-quality, beautiful Anthuriums and garden plants at Urban Leaf in Ganemulla, Gampaha. Island-wide courier delivery available across Sri Lanka. Bring nature home.",
    locale: "en_LK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Leaf - Anthurium Plant Nursery Ganemulla",
    description:
      "Discover high-quality Anthuriums and garden plants at Urban Leaf, Ganemulla, Gampaha. Island-wide delivery across Sri Lanka.",
  },
  keywords: [
    "Urban Leaf - Anthurium Plant Nursery",
    "Urban Leaf - Ganemulla",
    "Urban Leaf - Anthurium Plant Nursery Ganemulla",
    "Urban Leaf Sri Lanka",
    "Anthurium nursery Sri Lanka",
    "Anthuriums Gampaha",
    "Anthuriums Ganemulla",
    "buy anthurium plants Sri Lanka",
    "garden plants Gampaha",
    "plant nursery Ganemulla",
    "anthurium delivery Sri Lanka",
    "premium anthurium plants",
  ],
};

import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container">
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
        <GoogleAnalytics gaId="G-Q6GFSZNEF0" />
      </body>
    </html>
  );
}
