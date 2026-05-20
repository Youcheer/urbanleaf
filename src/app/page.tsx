"use client";

import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { PlantGrid } from "../components/PlantGrid";
import { AboutStory } from "../components/AboutStory";
import { Cart } from "../components/Cart";
import { useLanguage } from "../context/LanguageContext";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Urban Leaf - Anthurium Plant Nursery",
  url: "https://urbanleaf.vercel.app/",
  description:
    "Premium Anthurium and garden plant nursery in Ganemulla, Gampaha, Sri Lanka.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ganemulla",
    addressRegion: "Gampaha, Western Province",
    addressCountry: "LK",
  },
  telephone: "+94718546219",
  priceRange: "$$",
  sameAs: ["https://www.facebook.com/urbanleafsl", "https://share.google/6YkrYLRMocU7ARqmi"],
  hasMap: "https://maps.google.com/?q=Ganemulla,+Gampaha,+Sri+Lanka",
  areaServed: {
    "@type": "Country",
    name: "Sri Lanka",
  },
};


export default function Home() {
  const { language, t } = useLanguage();

  const getFooterStrings = () => {
    if (language === "si") {
      return {
        explore: "ගවේෂණය",
        sustainability: "තිරසාරභාවය",
        shipping: "නැව්ගත කිරීම් සහ ප්‍රතිලාභ",
        connect: "සම්බන්ධ වන්න",
        privacy: "රහස්‍යතා ප්‍රතිපත්තිය",
        contact: "අපව අමතන්න",
        rights: `© ${new Date().getFullYear()} Urban Leaf. නගරබද ජීවිතයට සොබාදහමේ සන්සුන් බව සහ සුන්දරත්වය ළඟා කර දීම.`,
      };
    }
    return {
      explore: "Explore",
      sustainability: "Sustainability",
      shipping: "Shipping & Returns",
      connect: "Connect",
      privacy: "Privacy Policy",
      contact: "Contact",
      rights: `© ${new Date().getFullYear()} Urban Leaf. Cultivating serenity in the urban landscape.`,
    };
  };

  const footer = getFooterStrings();

  return (
    <main className="min-h-screen">
      {/* JSON-LD LocalBusiness / Store Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation Bar */}
      <Navbar />
      
      {/* Hero Header Slider */}
      <Hero />
      
      {/* Curated Products Bento & Catalog Grid */}
      <PlantGrid />
      
      {/* Cultivating Serenity Story Section */}
      <AboutStory />
      
      {/* WhatsApp Checkout Sliding Shopping Cart */}
      <Cart />
      
      {/* Premium Multi-Column Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <a className="text-headline-md font-serif font-bold text-primary block" href="#home">
              Urban Leaf
            </a>
            <p className="text-body-md font-sans text-on-surface-variant max-w-sm leading-relaxed font-light">
              {t("footerSubheadline")}
            </p>
          </div>
          
          {/* Explore column */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-label-sm font-sans uppercase tracking-widest text-primary font-semibold mb-2">
              {footer.explore}
            </h4>
            <a className="text-body-md font-sans text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-300 font-light" href="#">
              {footer.sustainability}
            </a>
            <a className="text-body-md font-sans text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-300 font-light" href="#">
              {footer.shipping}
            </a>
          </div>
          
          {/* Connect column */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-label-sm font-sans uppercase tracking-widest text-primary font-semibold mb-2">
              {footer.connect}
            </h4>
            <a className="text-body-md font-sans text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-300 font-light" href="https://www.facebook.com/urbanleafsl" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a className="text-body-md font-sans text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-300 font-light" href="https://share.google/6YkrYLRMocU7ARqmi" target="_blank" rel="noopener noreferrer">
              Google Profile
            </a>
            <a className="text-body-md font-sans text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-300 font-light" href="#">
              {footer.contact}
            </a>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-outline-variant/10 px-margin-mobile md:px-margin-desktop py-6 text-center">
          <p className="text-label-sm font-sans text-outline tracking-wider font-light">
            {footer.rights}
          </p>
        </div>
      </footer>
    </main>
  );
}
