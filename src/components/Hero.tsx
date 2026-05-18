"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { getPlants } from "../lib/db";

const DEFAULT_HERO_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1WWZZ_Es3vP2_1o4-H8EeXdq0FKtjfY6JkkoQgO3fOYJsLe7I9Ef02pSUhIvMq9u4oqZ8HlWr06lEaXgb7WM6QxEiDL89RPhlcGO_ECnv-H-aLVZfXuE9B1Eo-0FR5VJr0_m3YSXHYr2XxnPVd3w3QR5DorIrQSLKrgR7bs0Kq8MLSDEFsCTBhwxrhFfAQiInl7_xpGr3OR-pZI5e8eFpk3JTl9N1mDBdL3OaolTl9Zo_PVlWJaJYZnX_8g52d28827YkDxczZOUQ",
  "https://lh3.googleusercontent.com/aida/ADBb0uhlniPhb1ptGJZv0LRyb89rACzkamaW7w9HrGXqOw8hV8nULPtjCm5Xu2T-e_8KVmm3W4Tm0TOsnFowPzgXidmZYP3FXCpvtCdxDALvZkkW6WvX3vYMdNGQUP5EzQafu9upN2YIqWbhmeS_mto_HRJKX9OgTB_yE0MaTU7gLb1029RBwlXEhmxEQ3JOIITLH-Xuvd7JYBkpFtsAtc99cG8rOLB79X8wRJ7NBFZ9tPtBpTAV1aGhBMkGr8PL",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBZgqW4-S_YxJ6a7ZZgAAhkiSNKsB8qdNzgs1LyaYgFSOYohXkPDhDA9-tGrbD99mxAjrOgGIrFknx0rkIQpXHKRuQXOdQrObeWm52RJbiXbX7gCjKIt0wtklSlwjzXCsuT-taSWEZ2Txw1rpHwOqsjeUdD4LLuHNik4rVBJIdL7ixZV59tJJR_ZukmraT1HfGszx3_wQgVTcC6hvHUx9JWoi-EfPDfo6BSr4AGz8N4kfxLQGRrYjVnlUw1WeypLlK9Un9TlufbfDhP",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA10AMdkwpZK8gAVI7s0X7YJUplwr6kvNF1t-VGg3o3GX3lnSJ-h1hQXxbavsIloIa8FPAnE6iO0eEvNSsXiLizyEfC8kzDNTo4i_4NrZPe7MalF0lmSvXpiUkptKRto0w63Nqs8eHuqX9m9xLRYNwxlxI8f6MqOnRwia0iToRo9loGWljgRELmg6q5lfTEQih7cwZedndqLbR1Ok-QIHZhLA6hM98tvvJ12bIudUvm7l9YXyd4fQ3Wm2Ld3yFOy296IPshsbnzk4hN",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ9Z1jOyq682XUwchB1kMAnJN99UFqzsrZmIaYEuGpRzMbSGZgM5JTg2Q7du1HjDEJIbKaRINe1Vbqs16VGIxio5DECRJz9hJVV11eCk-GB18SoM1eiXcm1X_xNOi5L_L5Y8YOdUOFlyV7pVzyul3re6PhOzfn_8Rfnu0IBavP6b752IPi3OfOhBNW5RwF78OuCWZx9hJCoTqQ2bSSLLfLRM9fFyUt-AIOAHQeu-77UUZ0vEXetaRbIUmRMROQiMO89I0zm-FxBf99",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAGnxJm_S-zdHr0xMfCViIV1D_ad_iGq_HDtbiOwiFNVUUv6DXiGpBAUlpmQYLwDrouFBhwqB-3P1vOuqj214zN0iD-NNTHjcvPvj9iH51gHpC12aYWOTJqFb7nd-M0Jp_RueB-UAX2uYYtu_mWqxfhqtIdYvG-SknDebi0OSL_hMqXM4zzfTwZmZRvKc8yiPAV92vDs6-kkplHcq20OsNtalXiXTSuI3UO1sSoGJ2DMdD2MBViNiwjjQzCUKi0V0FiyOOlhKKb3_J3"
];

export const Hero = () => {
  const { t } = useLanguage();
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const plants = await getPlants();
        let allImages: string[] = [];
        plants.forEach((p) => {
          if (p.images && p.images.length > 0) {
            allImages.push(p.images[0]);
          }
        });

        const uniqueImages = Array.from(new Set(allImages)).filter(
          (img) => typeof img === "string" && img.trim() !== "" && img.startsWith("http")
        );

        if (uniqueImages.length > 0) {
          // Shuffle and take up to 4 images
          const shuffled = uniqueImages.sort(() => 0.5 - Math.random());
          // Always ensure the beautiful default crimson anthurium is in the list
          setHeroImages([DEFAULT_HERO_IMAGES[0], ...shuffled.slice(0, 3)]);
        } else {
          setHeroImages(DEFAULT_HERO_IMAGES);
        }
      } catch (e) {
        console.error(e);
        setHeroImages(DEFAULT_HERO_IMAGES);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <header
      id="home"
      className="relative w-full h-[90vh] min-h-[650px] md:h-screen flex items-center justify-center overflow-hidden bg-surface-container-low"
    >
      {/* Background Image Slider with continuous Zoom-In effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          {heroImages.length > 0 ? (
            <motion.div
              key={currentImageIndex}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.0, ease: "easeInOut" }}
            >
              <motion.img
                src={heroImages[currentImageIndex]}
                alt="Botanical Background"
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1.0 }}
                animate={{ scale: 1.06 }}
                transition={{ duration: 7.0, ease: "easeOut" }}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-[#00261a]/10 animate-pulse" />
          )}
        </AnimatePresence>
        
        {/* Soft luxury editorial gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 z-10" />
      </div>

      {/* Hero Content - Luxury Glassmorphic Center Card */}
      <div className="relative z-20 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="max-w-2xl glass-panel p-8 md:p-12 rounded-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-display-lg-mobile md:text-display-lg font-serif text-primary mb-6 leading-tight"
          >
            {t("heroHeadline")}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-body-lg font-sans text-on-surface-variant mb-8 max-w-lg leading-relaxed"
          >
            {t("heroSubheadline")}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="#collection"
              className="inline-block bg-primary text-on-primary px-8 py-4 rounded-default hover:bg-surface-tint active:scale-95 transition-all duration-300 text-label-md font-sans font-semibold uppercase tracking-widest shadow-[0_8px_32px_rgba(0,38,26,0.15)]"
            >
              {t("heroCta")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};
