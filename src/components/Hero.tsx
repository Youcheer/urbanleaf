"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getPlants } from "../lib/db";
import { useLanguage } from "../context/LanguageContext";

const DEFAULT_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1597055905091-88981f337f7a?auto=format&fit=crop&q=80&w=1200",
];

export const Hero = () => {
  const { scrollY } = useScroll();
  const { t } = useLanguage();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <section id="home" className="relative min-h-screen pt-24 lg:pt-0 flex items-center justify-center overflow-hidden bg-[#f4f7f4]">
      {/* Background Floating Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-20 -left-10 w-64 h-64 bg-[#3b8554]/10 rounded-full blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 -right-10 w-96 h-96 bg-[#1a4a28]/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 w-full py-12 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ opacity }}
          className="text-left"
        >
          {/* Sinhala & English Multi-lingual Headline & Subheadline */}
          <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight text-[#1a4a28] mb-6 whitespace-pre-line">
            {t("heroHeadline")}
          </h1>
          <p className="text-base md:text-lg text-[#1a4a28]/80 mb-8 max-w-lg leading-relaxed">
            {t("heroSubheadline")}
          </p>
          <a
            href="#collection"
            className="inline-flex items-center gap-2 bg-[#1a4a28] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#3b8554] transition-all transform hover:scale-105"
          >
            {t("heroCta")}
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-[45vh] lg:h-[70vh] w-full"
          style={{ perspective: 1200 }}
        >
          {/* Main Hero Image Slider with 3D Flip */}
          <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-[#e2e8e4]/40" style={{ transformStyle: "preserve-3d" }}>
            {heroImages.length > 0 ? (
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={heroImages[currentImageIndex]}
                  alt={`Beautiful Plant ${currentImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover bg-gray-100"
                  initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -90, scale: 1.1 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                  style={{ backfaceVisibility: "hidden" }}
                />
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-[#e2e8e4]/60 animate-pulse" />
            )}
          </div>
          
          {/* Floating Element 1 */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-4 -left-4 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 scale-90 md:scale-100"
          >
            <div className="w-10 h-10 bg-[#f4f7f4] rounded-full flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <p className="font-bold text-[#1a4a28] text-sm">{t("organic")}</p>
              <p className="text-xs text-gray-500">{t("premiumQuality")}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
