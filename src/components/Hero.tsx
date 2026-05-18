"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { getPlants } from "../lib/db";

const DEFAULT_HERO_IMAGES = [
  "/about_gardener.jpg"
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
          setHeroImages(shuffled.slice(0, 4));
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
