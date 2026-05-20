"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plant } from "../lib/data";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export const PlantCard = ({ plant, onClick }: { plant: Plant; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { language } = useLanguage();

  const mainImage = plant.images && plant.images.length > 0 ? plant.images[0] : plant.image;

  // Let's get translation for Add to Cart
  const getAddToCartText = () => {
    return language === "si" ? "කරත්තයට එක් කරන්න" : "Add to Cart";
  };

  // Tag helper
  const getTag = () => {
    if (plant.id === "p1") {
      return language === "si" ? "වැඩිම ඉල්ලුමක් ඇති" : "Bestseller";
    }
    if (plant.id === "p2") {
      return language === "si" ? "දුර්ලභ වර්ගයක්" : "Rare Find";
    }
    return null;
  };

  const tag = getTag();

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative overflow-hidden rounded-[var(--radius-leaf)] bg-white/60 dark:bg-surface/60 backdrop-blur-xl border border-white dark:border-white/10 border-t-2 border-t-[var(--color-accent)] shadow-[0_8px_32px_rgba(0,38,26,0.03)] hover:shadow-[0_24px_48px_rgba(0,38,26,0.08)] hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer aspect-[3/4] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Zoom effect */}
      <div className="w-full h-full overflow-hidden absolute inset-0 z-0">
        <motion.img
          alt={plant.name}
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src={mainImage}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Top Floating Tag */}
      {tag && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/80 dark:bg-surface/90 backdrop-blur-md rounded-[var(--radius-leaf-reverse)] font-sans text-[11px] uppercase tracking-widest text-primary dark:text-primary-fixed border border-white/50 dark:border-white/10 font-semibold shadow-sm">
            {tag}
          </span>
        </div>
      )}

      {/* Glassmorphism Bottom Overlay */}
      <div 
        className={`mt-auto relative z-10 p-5 bg-white/80 dark:bg-surface-container/95 backdrop-blur-xl border-t border-white/30 dark:border-white/10 flex flex-col transition-all duration-500 ease-out translate-y-0 md:translate-y-14 md:group-hover:translate-y-0`}
      >
        <div className="flex justify-between items-start mb-2 gap-2">
          <div>
            <h3 className="font-serif text-base md:text-lg text-primary dark:text-primary-fixed leading-snug font-semibold">
              {plant.name}
            </h3>
            <p className="text-[10px] font-sans text-on-surface-variant italic font-light mt-0.5">
              {plant.scientificName}
            </p>
          </div>
          <span className="font-sans text-xs md:text-sm text-[var(--color-accent)] dark:text-primary-fixed font-semibold whitespace-nowrap">
            LKR {plant.price.toLocaleString()}
          </span>
        </div>
        
        {/* Care specifications */}
        <p className="font-sans text-[11px] text-on-surface-variant mb-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-normal line-clamp-1">
          {plant.care.sunlight} • {plant.care.watering}
        </p>

        {/* Slide-up Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(plant);
          }}
          className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-[var(--radius-leaf-reverse)] font-sans text-xs uppercase tracking-widest hover:scale-[0.98] active:scale-95 transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 delay-150 font-semibold cursor-pointer"
        >
          {getAddToCartText()}
        </button>
      </div>
    </motion.div>
  );
};
