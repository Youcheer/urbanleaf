import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://urbanleaf.vercel.app"),
  title: "Urban Leaf | Premium Anthuriums & Indoor Plants Sri Lanka",
  description:
    "Buy healthy, beautiful Anthuriums and premium indoor plants online at Urban Leaf Sri Lanka. Island-wide courier delivery available. Fresh green luxury for your space.",
  alternates: {
    canonical: "https://urbanleaf.vercel.app/",
  },
  verification: {
    google: "PLACEHOLDER_FOR_GOOGLE_VERIFICATION_CODE",
  },
  openGraph: {
    type: "website",
    url: "https://urbanleaf.vercel.app/",
    siteName: "Urban Leaf",
    title: "Urban Leaf | Premium Anthuriums & Indoor Plants Sri Lanka",
    description:
      "Buy healthy, beautiful Anthuriums and premium indoor plants online at Urban Leaf Sri Lanka. Island-wide courier delivery available. Fresh green luxury for your space.",
    locale: "en_LK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Leaf | Premium Anthuriums & Indoor Plants Sri Lanka",
    description:
      "Buy healthy, beautiful Anthuriums and premium indoor plants online at Urban Leaf Sri Lanka. Island-wide courier delivery available.",
  },
  keywords: [
    "Urban Leaf",
    "Anthuriums Sri Lanka",
    "buy anthurium plants",
    "indoor plants Sri Lanka",
    "premium plants Colombo",
    "plant shop Sri Lanka",
    "anthurium delivery Sri Lanka",
    "Ganemulla nursery",
  ],
};

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
      </body>
    </html>
  );
}
