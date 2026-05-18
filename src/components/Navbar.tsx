"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export const Navbar = () => {
  const { cart, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Determine which section is currently active
      const sections = ["home", "collection", "about"];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b backdrop-blur-xl ${
        scrolled
          ? "py-4 bg-white/90 dark:bg-tertiary/90 border-outline-variant/20 shadow-[0_8px_30px_rgba(0,38,26,0.08)]"
          : "py-6 bg-white/60 dark:bg-tertiary/60 border-white/20 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.04)]"
      }`}
    >
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Brand Logo */}
        <a
          href="#home"
          className="text-headline-md font-serif font-bold text-primary dark:text-primary-fixed tracking-tight hover:opacity-80 transition-opacity"
        >
          Urban Leaf
        </a>

        {/* Navigation Links with dot indicators */}
        <div className="hidden md:flex space-x-8 items-center">
          <a
            href="#home"
            className={`text-label-md font-sans uppercase tracking-widest relative py-1 transition-colors duration-300 scale-98 active:scale-95 ease-out ${
              activeSection === "home"
                ? "text-primary dark:text-primary-fixed font-semibold"
                : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed"
            }`}
          >
            {t("home")}
            {activeSection === "home" && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary dark:bg-primary-fixed rounded-full" />
            )}
          </a>
          <a
            href="#collection"
            className={`text-label-md font-sans uppercase tracking-widest relative py-1 transition-colors duration-300 scale-98 active:scale-95 ease-out ${
              activeSection === "collection"
                ? "text-primary dark:text-primary-fixed font-semibold"
                : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed"
            }`}
          >
            {t("collection")}
            {activeSection === "collection" && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary dark:bg-primary-fixed rounded-full" />
            )}
          </a>
          <a
            href="#about"
            className={`text-label-md font-sans uppercase tracking-widest relative py-1 transition-colors duration-300 scale-98 active:scale-95 ease-out ${
              activeSection === "about"
                ? "text-primary dark:text-primary-fixed font-semibold"
                : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed"
            }`}
          >
            {t("aboutUs")}
            {activeSection === "about" && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary dark:bg-primary-fixed rounded-full" />
            )}
          </a>
        </div>

        {/* Right Nav Options (Language and Cart) */}
        <div className="flex items-center space-x-6">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "si" : "en")}
            className="text-label-sm font-sans uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all active:scale-95 px-3 py-1.5 rounded-full border border-outline-variant/30 bg-surface-container-lowest/50 backdrop-blur-sm"
          >
            {language === "en" ? "සිංහල 🇱🇰" : "English 🇬🇧"}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-primary hover:scale-110 active:scale-95 transition-all duration-200 relative p-1"
          >
            <span className="material-symbols-outlined block text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              shopping_cart
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-[0_2px_8px_rgba(0,38,26,0.2)]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
