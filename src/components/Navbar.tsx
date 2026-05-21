"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { cart, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Only do scroll spy on the home page
      if (pathname === "/") {
        const sections = ["home", "collection", "about"];
        const scrollPosition = window.scrollY + 100;
        
        let found = false;
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              found = true;
              break;
            }
          }
        }
        // If we scrolled past everything somehow, fallback
        if (!found && scrollPosition < 500) {
           setActiveSection("home");
        }
      } else {
        if (pathname.includes("/care-guides")) {
          setActiveSection("care-guides");
        } else if (pathname.includes("/gallery")) {
          setActiveSection("gallery");
        } else {
          setActiveSection("");
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b ${
          scrolled
            ? "py-4 border-outline-variant/20 shadow-[0_8px_30px_rgba(0,38,26,0.08)] bg-surface/95 backdrop-blur-md dark:bg-surface/95 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
            : "py-6 border-outline-variant/10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] bg-surface/80 backdrop-blur-sm dark:bg-surface/80"
        }`}
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {/* Brand Logo */}
          <a
            href="/#home"
            className="hover:opacity-80 transition-opacity flex items-center shrink-0"
          >
            <img src="/logo.png" alt="Urban Leaf Logo" className="h-10 md:h-12 w-auto object-contain" />
          </a>

          {/* Navigation Links with dot indicators */}
          <div className="hidden md:flex space-x-8 items-center">
            <a
              href="/#home"
              className={`text-label-md font-sans uppercase tracking-widest relative py-1 transition-colors duration-300 scale-98 active:scale-95 ease-out font-medium ${activeSection === "home" ? "text-on-surface" : "text-on-surface/60"}`}
            >
              {t("home")}
              {activeSection === "home" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-on-surface" />
              )}
            </a>
            <a
              href="/#collection"
              className={`text-label-md font-sans uppercase tracking-widest relative py-1 transition-colors duration-300 scale-98 active:scale-95 ease-out font-medium ${activeSection === "collection" ? "text-on-surface" : "text-on-surface/60"}`}
            >
              {t("collection")}
              {activeSection === "collection" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-on-surface" />
              )}
            </a>
            <a
              href="/care-guides"
              className={`text-label-md font-sans uppercase tracking-widest relative py-1 transition-colors duration-300 scale-98 active:scale-95 ease-out font-medium ${activeSection === "care-guides" ? "text-on-surface" : "text-on-surface/60 hover:text-on-surface"}`}
            >
              {t("careGuides")}
              {activeSection === "care-guides" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-on-surface" />
              )}
            </a>
            <a
              href="/gallery"
              className={`text-label-md font-sans uppercase tracking-widest relative py-1 transition-colors duration-300 scale-98 active:scale-95 ease-out font-medium ${activeSection === "gallery" ? "text-on-surface" : "text-on-surface/60 hover:text-on-surface"}`}
            >
              {t("gallery")}
              {activeSection === "gallery" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-on-surface" />
              )}
            </a>
            <a
              href="/#about"
              className={`text-label-md font-sans uppercase tracking-widest relative py-1 transition-colors duration-300 scale-98 active:scale-95 ease-out font-medium ${activeSection === "about" ? "text-on-surface" : "text-on-surface/60"}`}
            >
              {t("aboutUs")}
              {activeSection === "about" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-on-surface" />
              )}
            </a>
          </div>

          {/* Right Nav Options (Language, Theme, Cart) */}
          <div className="flex items-center space-x-3 md:space-x-5">
            {/* Theme Switcher */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="hover:scale-110 active:scale-95 transition-all duration-200 relative p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-on-surface"
                title="Toggle Dark Mode"
              >
                <span className="material-symbols-outlined block text-[20px] md:text-[22px]">
                  {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
                </span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "en" ? "si" : "en")}
              className="text-[10px] md:text-label-sm font-sans uppercase tracking-widest transition-all active:scale-95 px-2 md:px-3 py-1 md:py-1.5 rounded-full border bg-surface/50 backdrop-blur-sm font-semibold text-on-surface border-outline-variant/30"
            >
              {language === "en" ? "සිංහල 🇱🇰" : "English 🇬🇧"}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:scale-110 active:scale-95 transition-all duration-200 relative p-1 text-on-surface"
            >
              <span className="material-symbols-outlined block text-[24px] md:text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                shopping_cart
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-on-primary bg-primary text-[9px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold shadow-[0_2px_8px_rgba(0,38,26,0.2)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-outline-variant/20 z-[40] px-6 py-3 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pb-safe">
        <a
          href="/#home"
          className="flex flex-col items-center gap-1 transition-colors w-16"
          style={{ color: activeSection === "home" ? "var(--color-primary)" : "var(--color-outline)" }}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeSection === "home" ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">{t("home")}</span>
        </a>
        <a
          href="/#collection"
          className="flex flex-col items-center gap-1 transition-colors w-16"
          style={{ color: activeSection === "collection" ? "var(--color-primary)" : "var(--color-outline)" }}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeSection === "collection" ? "'FILL' 1" : "'FILL' 0" }}>local_florist</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">{t("collection")}</span>
        </a>
        <a
          href="/care-guides"
          className="flex flex-col items-center gap-1 transition-colors w-16"
          style={{ color: activeSection === "care-guides" ? "var(--color-primary)" : "var(--color-outline)" }}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeSection === "care-guides" ? "'FILL' 1" : "'FILL' 0" }}>menu_book</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-center leading-tight">Blog &<br/>Guides</span>
        </a>
        <a
          href="/gallery"
          className="flex flex-col items-center gap-1 transition-colors w-16"
          style={{ color: activeSection === "gallery" ? "var(--color-primary)" : "var(--color-outline)" }}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeSection === "gallery" ? "'FILL' 1" : "'FILL' 0" }}>photo_library</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">{t("gallery")}</span>
        </a>
        <a
          href="/#about"
          className="flex flex-col items-center gap-1 transition-colors w-16"
          style={{ color: activeSection === "about" ? "var(--color-primary)" : "var(--color-outline)" }}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeSection === "about" ? "'FILL' 1" : "'FILL' 0" }}>info</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">{t("aboutUs")}</span>
        </a>
      </div>
    </>
  );
};
