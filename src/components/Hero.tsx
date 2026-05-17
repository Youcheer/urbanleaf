"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getPlants } from "../lib/db";
import { useLanguage } from "../context/LanguageContext";

const DEFAULT_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1597055905091-88981f337f7a?auto=format&fit=crop&q=80&w=1200",
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
        plants.forEach(p => {
          if (p.images && p.images.length > 0) {
            allImages.push(p.images[0]);
          } else if ((p as any).image) {
            allImages.push((p as any).image);
          }
        });
        
        const uniqueImages = Array.from(new Set(allImages)).filter(
          (img) => typeof img === "string" && img.trim() !== "" && img.startsWith("http")
        );
        
        if (uniqueImages.length > 0) {
          const shuffled = uniqueImages.sort(() => 0.5 - Math.random());
          setHeroImages(shuffled.slice(0, 6)); // Keep up to 6 images for the slider
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
    }, 5000); 
    return () => clearInterval(interval);
  }, [heroImages]);

  const renderDesktopImages = () => {
    if (heroImages.length === 1) {
      return (
        <div className="w-full h-full relative">
          <AnimatePresence initial={false}>
            <motion.img
              key={`d-0-${currentImageIndex}`}
              src={heroImages[0]}
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          </AnimatePresence>
        </div>
      );
    } else if (heroImages.length === 2) {
      return [0, 1].map((offset) => (
        <div key={offset} className="w-1/2 h-full relative">
          <AnimatePresence initial={false}>
            <motion.img
              key={`d-${offset}-${currentImageIndex}`}
              src={heroImages[(currentImageIndex + offset) % heroImages.length]}
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          </AnimatePresence>
        </div>
      ));
    } else {
      return [0, 1, 2].map((offset) => (
        <div key={offset} className="w-1/3 h-full relative">
          <AnimatePresence initial={false}>
            <motion.img
              key={`d-${offset}-${currentImageIndex}`}
              src={heroImages[(currentImageIndex + offset) % heroImages.length]}
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          </AnimatePresence>
        </div>
      ));
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] md:h-screen flex flex-col justify-end items-center overflow-hidden bg-black">
      {/* Dynamic Grid Image Display */}
      <div className="absolute inset-0 z-0 flex">
        {heroImages.length > 0 ? (
          <>
            {/* Mobile View: Always 1 image to save space */}
            <div className="w-full h-full md:hidden relative">
              <AnimatePresence initial={false}>
                <motion.img
                  key={`mobile-${currentImageIndex}`}
                  src={heroImages[currentImageIndex]}
                  className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                />
              </AnimatePresence>
            </div>

            {/* Desktop View: Dynamic columns (1, 2, or 3 images side-by-side) */}
            <div className="hidden md:flex w-full h-full">
              {renderDesktopImages()}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#1a4a28]/20 animate-pulse" />
        )}
        
        {/* Premium Gradient Overlays for readable text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80 z-10" />
      </div>

      {/* Hero Text Content - Overlaid at the bottom */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 w-full pb-20 md:pb-28 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl text-white">
            {t("heroHeadline")}
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-light tracking-wide">
            {t("heroSubheadline")}
          </p>
          <a
            href="#collection"
            className="inline-flex items-center gap-3 bg-white text-[#1a4a28] px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-[#3b8554] hover:text-white transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            {t("heroCta")}
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
