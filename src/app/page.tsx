import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { PlantGrid } from "../components/PlantGrid";
import { Cart } from "../components/Cart";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PlantGrid />
      <Cart />
      
      <footer className="bg-[#153b20] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl font-bold mb-4">Urban Leaf</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Bringing the beauty of nature into your home with our premium, carefully curated indoor plant collection in Sri Lanka.
          </p>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Urban Leaf. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
