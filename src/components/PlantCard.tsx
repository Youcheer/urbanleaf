"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plant } from "../lib/data";
import { useCart } from "../context/CartContext";

export const PlantCard = ({ plant, onClick }: { plant: Plant; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const mainImage = plant.images && plant.images.length > 0 ? plant.images[0] : plant.image;

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative rounded-xl overflow-hidden glass-panel flex flex-col shadow-[0_4px_40px_rgba(0,38,26,0.06)] hover:shadow-[0_12px_60px_rgba(0,38,26,0.12)] transition-all duration-500 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image and Care Instructions Overlay */}
      <div className="relative h-80 w-full overflow-hidden bg-surface-container-low">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src={mainImage}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
        
        {/* Care Instructions Overlay using premium Glassmorphism */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/40 dark:bg-tertiary/40 backdrop-blur-[6px] flex flex-col justify-center items-center gap-4 text-white p-6"
            >
              <div className="flex items-center gap-3 w-full max-w-[200px] bg-white/10 p-2.5 rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-yellow-300 text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                  sunny
                </span>
                <span className="text-xs font-sans tracking-wide font-medium">{plant.care.sunlight}</span>
              </div>
              
              <div className="flex items-center gap-3 w-full max-w-[200px] bg-white/10 p-2.5 rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-blue-300 text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                  water_drop
                </span>
                <span className="text-xs font-sans tracking-wide font-medium">{plant.care.watering}</span>
              </div>
              
              <div className="flex items-center gap-3 w-full max-w-[200px] bg-white/10 p-2.5 rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-orange-300 text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                  thermostat
                </span>
                <span className="text-xs font-sans tracking-wide font-medium">{plant.care.environment}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Quick Add to Cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(plant);
          }}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md w-11 h-11 rounded-full shadow-lg text-primary flex items-center justify-center hover:bg-primary hover:text-white active:scale-90 transition-all duration-300 z-10"
        >
          <span className="material-symbols-outlined font-light text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>
            add
          </span>
        </button>
      </div>

      {/* Card Info Details */}
      <div className="p-6 flex flex-col flex-grow justify-between bg-white/40 dark:bg-tertiary/20">
        <div>
          <h3 className="font-serif text-lg text-primary group-hover:text-surface-tint transition-colors duration-300 font-semibold leading-snug">
            {plant.name}
          </h3>
          <p className="text-xs font-sans text-on-surface-variant italic mt-1 font-light">
            {plant.scientificName}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
          <span className="text-body-md font-sans text-primary font-semibold">
            LKR {plant.price.toLocaleString()}
          </span>
          <span className="text-[10px] font-sans uppercase tracking-widest text-outline font-semibold">
            {plant.category && plant.category.length > 0 ? plant.category[0] : ""}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
