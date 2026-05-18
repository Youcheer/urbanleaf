"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plant } from "../lib/data";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export const PlantModal = ({ plant, onClose }: { plant: Plant; onClose: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const images = plant.images && plant.images.length > 0 ? plant.images : (plant.image ? [plant.image] : []);

  const handleNext = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-tertiary rounded-[1.5rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh] border border-outline-variant/20"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/90 dark:bg-tertiary/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg text-primary hover:text-error transition-colors border border-outline-variant/20 active:scale-90"
          >
            <span className="material-symbols-outlined block text-lg font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
              close
            </span>
          </button>

          {/* Left: Image Gallery */}
          <div className="w-full md:w-1/2 relative bg-surface-container min-h-[40vh] md:min-h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={images[currentImage]}
                alt={plant.name}
                className="w-full h-full absolute inset-0 object-cover"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2.5 rounded-full shadow-lg text-primary hover:bg-white active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined block font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2.5 rounded-full shadow-lg text-primary hover:bg-white active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined block font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chevron_right
                  </span>
                </button>
                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all shadow-md ${
                        currentImage === idx ? "bg-white scale-125" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col bg-background/50 dark:bg-tertiary/30">
            <h2 className="font-serif text-3xl font-bold text-primary mb-2 leading-tight uppercase">{plant.name}</h2>
            <p className="text-on-surface-variant/70 italic text-base mb-6 font-sans font-light">{plant.scientificName}</p>
            
            <p className="text-3xl font-sans font-semibold text-primary mb-8">
              LKR {plant.price.toLocaleString()}
            </p>

            <div className="mb-8">
              <h3 className="font-serif text-lg font-semibold text-primary mb-3">{t("description")}</h3>
              <p className="text-on-surface-variant font-sans leading-relaxed font-light">
                {plant.description || "A beautiful, carefully nurtured Anthurium ready to bring life and fresh air to your outdoor space."}
              </p>
            </div>

            {/* Care details structured in a sleek glass panel */}
            <div className="space-y-4 mb-10 bg-white/40 dark:bg-tertiary/40 border border-outline-variant/35 p-6 rounded-xl shadow-[0_4px_24px_rgba(0,38,26,0.02)]">
              <h3 className="font-serif text-base font-semibold text-primary mb-4">{t("careInstructions")}</h3>
              
              <div className="flex items-center gap-4 text-on-surface">
                <div className="w-10 h-10 bg-secondary-container/50 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    sunny
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold font-sans">{t("sunlight")}</p>
                  <p className="font-medium font-sans text-sm">{plant.care.sunlight}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-on-surface">
                <div className="w-10 h-10 bg-secondary-container/50 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    water_drop
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold font-sans">{t("watering")}</p>
                  <p className="font-medium font-sans text-sm">{plant.care.watering}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-on-surface">
                <div className="w-10 h-10 bg-secondary-container/50 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    thermostat
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold font-sans">{t("environment")}</p>
                  <p className="font-medium font-sans text-sm">{plant.care.environment}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-outline-variant/10">
              <button
                onClick={() => {
                  addToCart(plant);
                  onClose();
                }}
                className="w-full bg-primary text-on-primary py-4 rounded-default font-sans font-semibold hover:bg-surface-tint active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-3 text-base uppercase tracking-widest shadow-[0_8px_32px_rgba(0,38,26,0.1)]"
              >
                <span className="material-symbols-outlined text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                  shopping_cart
                </span>
                {t("addToCart")}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
