"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

export const Navbar = () => {
  const { cart, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount to set initial state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 cursor-pointer relative group">
          {/* Subtle white glow behind logo when at the top to ensure visibility over dark images */}
          <div className={`absolute inset-0 bg-white/80 blur-xl rounded-full transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`} />
          <img src="/logo.png" alt="Urban Leaf Logo" className="h-12 md:h-16 w-auto object-contain relative z-10" />
        </a>

        {/* Navigation links translated */}
        <div className={`hidden md:flex items-center gap-8 font-semibold transition-colors duration-500 ${scrolled ? 'text-[#1a4a28]' : 'text-white drop-shadow-md'}`}>
          <a href="#home" className={`transition-colors ${scrolled ? 'hover:text-[#3b8554]' : 'hover:text-gray-300'}`}>{t("home")}</a>
          <a href="#collection" className={`transition-colors ${scrolled ? 'hover:text-[#3b8554]' : 'hover:text-gray-300'}`}>{t("collection")}</a>
          <a href="#about" className={`transition-colors ${scrolled ? 'hover:text-[#3b8554]' : 'hover:text-gray-300'}`}>{t("aboutUs")}</a>
        </div>

        <div className="flex items-center gap-4">
          {/* Elegant Language Switcher Button */}
          <button
            onClick={() => setLanguage(language === "en" ? "si" : "en")}
            className={`px-3.5 py-1.5 rounded-full border transition-all duration-500 text-xs font-bold font-sans tracking-wide backdrop-blur-sm active:scale-95 shadow-sm ${
              scrolled 
                ? "border-[#1a4a28]/20 text-[#1a4a28] hover:border-[#3b8554] hover:text-[#3b8554] bg-white/50" 
                : "border-white/40 text-white hover:border-white hover:bg-white/20 bg-black/20"
            }`}
          >
            {language === "en" ? "සිංහල 🇱🇰" : "English 🇬🇧"}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2 transition-colors duration-500 ${
              scrolled ? 'text-[#1a4a28] hover:text-[#3b8554]' : 'text-white hover:text-gray-300 drop-shadow-md'
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className={`absolute top-0 right-0 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm ${
                scrolled ? 'bg-[#3b8554] text-white' : 'bg-white text-[#1a4a28]'
              }`}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
