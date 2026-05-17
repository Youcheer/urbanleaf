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
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 5 seconds for a majestic full screen experience
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-end items-center overflow-hidden bg-black">
      {/* Full Screen Image Slider */}
      <div className="absolute inset-0 z-0">
        {heroImages.length > 0 ? (
          <AnimatePresence initial={false}>
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt={`Urban Leaf Collection`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#1a4a28]/20 animate-pulse" />
        )}
        
        {/* Premium Gradient Overlay: Dark top for Navbar, dark bottom for Text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 z-10" />
      </div>

      {/* Hero Text Content - Overlaid at the bottom */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 w-full pb-20 md:pb-32 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl">
            {t("heroHeadline")}
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-light tracking-wide">
            {t("heroSubheadline")}
          </p>
          <a
            href="#collection"
            className="inline-flex items-center gap-3 bg-white text-[#1a4a28] px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-[#3b8554] hover:text-white transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            {t("heroCta")}
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
