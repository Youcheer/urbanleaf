"use client";

import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { PlantGrid } from "../components/PlantGrid";
import { Cart } from "../components/Cart";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PlantGrid />
      <Cart />
      
      <footer className="bg-[#153b20] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl font-bold mb-4">Urban Leaf</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
            {t("footerSubheadline")}
          </p>
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Urban Leaf. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
