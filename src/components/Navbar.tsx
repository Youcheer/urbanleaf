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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.png" alt="Urban Leaf Logo" className="h-12 md:h-16 w-auto object-contain" />
        </a>

        {/* Navigation links translated */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-[#1a4a28]">
          <a href="#home" className="hover:text-[#3b8554] transition-colors">{t("home")}</a>
          <a href="#collection" className="hover:text-[#3b8554] transition-colors">{t("collection")}</a>
          <a href="#about" className="hover:text-[#3b8554] transition-colors">{t("aboutUs")}</a>
        </div>

        <div className="flex items-center gap-4">
          {/* Elegant Language Switcher Button */}
          <button
            onClick={() => setLanguage(language === "en" ? "si" : "en")}
            className="px-3.5 py-1.5 rounded-full border border-[#1a4a28]/20 text-[#1a4a28] hover:border-[#3b8554] hover:text-[#3b8554] transition-all text-xs font-bold font-sans tracking-wide bg-white/50 backdrop-blur-sm active:scale-95 shadow-sm"
          >
            {language === "en" ? "සිංහල 🇱🇰" : "English 🇬🇧"}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#1a4a28] hover:text-[#3b8554] transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#3b8554] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
