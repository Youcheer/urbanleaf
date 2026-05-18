"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plant } from "../lib/data";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export const PlantModal = ({ plant, onClose }: { plant: Plant; onClose: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<"care" | "shipping" | null>("care"); // Default open care guide
  
  const { addToCart } = useCart();
  const { language, t } = useLanguage();

  const images = plant.images && plant.images.length > 0 ? plant.images : (plant.image ? [plant.image] : []);

  const handleNext = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  // Translation helpers
  const getModalTranslations = () => {
    if (language === "si") {
      return {
        rareCollection: "දුර්ලභ එකතුව",
        botanicalCollection: "තෝරාගත් ශාක එකතුව",
        freeShippingText: "දිවයින පුරා නොමිලේ එදිනම ශීතකරණ පහසුකම් සහිත බෙදාහැරීම ඇතුළත් වේ.",
        careGuide: "රැකබලා ගැනීමේ උපදෙස්",
        shippingReturns: "නැව්ගත කිරීම් සහ ප්‍රතිලාභ",
        securePurchase: "කරත්තයට එක් කරන්න",
        shippingDetails: "නොමිලේ එදිනම ශීතකරණ පහසුකම් සහිත විශේෂිත කුරියර් සේවාව මඟින් බෙදා හැරීම සිදු කෙරේ. පැළෑටිවල නැවුම් බව සහ ප්‍රකෘතිමත්භාවය උපරිමයෙන් ආරක්ෂා වන සේ ඉතා ප්‍රවේශමෙන් ඇසුරුම් කරනු ලැබේ. කිසියම් හානියක් සිදුවුවහොත් දින 7ක් ඇතුළත ආපසු භාරගෙන නව පැළයක් හෝ මුදල් ආපසු ලබාදේ.",
      };
    }
    return {
      rareCollection: "Rare Collection",
      botanicalCollection: "Botanical Collection",
      freeShippingText: "Complimentary nationwide overnight shipping included.",
      careGuide: "Care Guide",
      shippingReturns: "Shipping & Returns",
      securePurchase: "Secure Purchase",
      shippingDetails: "Complimentary climate-controlled overnight transport directly to your door. Packaged meticulously in our custom thermal eco-sleeves to ensure pristine structural health and moisture retention. If your specimen arrives with any structural damage, notify us within 7 days for a complimentary replacement or full refund.",
    };
  };

  const labels = getModalTranslations();

  // Dynamic tag determination
  const tag = plant.category.includes("Rare Finds") ? labels.rareCollection : labels.botanicalCollection;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background dark:bg-tertiary rounded-[1.5rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh] border border-outline-variant/20"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/90 dark:bg-tertiary/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg text-primary hover:text-error transition-colors border border-outline-variant/20 active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined block text-lg font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
              close
            </span>
          </button>

          {/* Left: Premium Image Gallery with Entrance Animation */}
          <div className="w-full md:w-1/2 relative bg-surface-container min-h-[40vh] md:min-h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                src={images[currentImage]}
                alt={plant.name}
                className="w-full h-full absolute inset-0 object-cover object-center"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-tertiary/80 p-2.5 rounded-full shadow-lg text-primary dark:text-white hover:bg-white active:scale-90 transition-all cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined block font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-tertiary/80 p-2.5 rounded-full shadow-lg text-primary dark:text-white hover:bg-white active:scale-90 transition-all cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined block font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chevron_right
                  </span>
                </button>
                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all shadow-md cursor-pointer ${
                        currentImage === idx ? "bg-white scale-125" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Glassmorphic Details Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col bg-white/40 dark:bg-tertiary/40 backdrop-blur-xl border-l border-white/20 dark:border-white/10 max-h-[90vh]">
            
            {/* Headline tag & names */}
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 bg-secondary-container/50 text-primary dark:text-primary-fixed font-sans text-[11px] font-semibold rounded-full tracking-widest uppercase mb-4 border border-secondary-container">
                {tag}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary dark:text-primary-fixed mb-2 leading-tight uppercase">
                {plant.name}
              </h2>
              <p className="text-secondary/80 dark:text-on-primary-container italic text-base font-serif">
                {plant.scientificName}
              </p>
            </div>

            {/* Pricing block */}
            <div className="py-5 border-y border-outline-variant/30 mb-6">
              <p className="font-serif text-3xl font-bold text-primary dark:text-primary-fixed">
                LKR {plant.price.toLocaleString()}
              </p>
              <p className="text-[11px] font-sans text-on-surface-variant mt-2 tracking-wide font-light">
                {labels.freeShippingText}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-on-surface-variant font-sans text-sm md:text-base leading-relaxed font-light">
                {plant.description}
              </p>
            </div>

            {/* Care Guide & Shipping Accordion */}
            <div className="mb-8 border-t border-outline-variant/20">
              
              {/* Accordion: Care Guide */}
              <div className="border-b border-outline-variant/20 py-4">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
                  className="w-full flex justify-between items-center text-left cursor-pointer group focus:outline-none border-none bg-transparent"
                >
                  <h3 className="font-serif text-primary dark:text-primary-fixed text-base font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    {labels.careGuide}
                  </h3>
                  <span className={`material-symbols-outlined text-primary dark:text-primary-fixed transition-transform duration-300 ${activeAccordion === "care" ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {activeAccordion === "care" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-3 font-sans text-xs">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-base">sunny</span>
                          </div>
                          <div>
                            <span className="font-semibold text-primary dark:text-primary-fixed uppercase tracking-wider block text-[9px]">{t("sunlight")}</span>
                            <span className="text-on-surface-variant font-light">{plant.care.sunlight}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-base">water_drop</span>
                          </div>
                          <div>
                            <span className="font-semibold text-primary dark:text-primary-fixed uppercase tracking-wider block text-[9px]">{t("watering")}</span>
                            <span className="text-on-surface-variant font-light">{plant.care.watering}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-base">thermostat</span>
                          </div>
                          <div>
                            <span className="font-semibold text-primary dark:text-primary-fixed uppercase tracking-wider block text-[9px]">{t("environment")}</span>
                            <span className="text-on-surface-variant font-light">{plant.care.environment}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion: Shipping & Returns */}
              <div className="border-b border-outline-variant/20 py-4">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
                  className="w-full flex justify-between items-center text-left cursor-pointer group focus:outline-none border-none bg-transparent"
                >
                  <h3 className="font-serif text-primary dark:text-primary-fixed text-base font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    {labels.shippingReturns}
                  </h3>
                  <span className={`material-symbols-outlined text-primary dark:text-primary-fixed transition-transform duration-300 ${activeAccordion === "shipping" ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {activeAccordion === "shipping" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 text-xs font-sans text-on-surface-variant leading-relaxed font-light">
                        {labels.shippingDetails}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Secure Purchase / Add to Cart Action */}
            <div className="mt-auto">
              <button
                onClick={() => {
                  addToCart(plant);
                  onClose();
                }}
                className="w-full bg-primary text-on-primary py-4 rounded-default font-sans font-semibold hover:bg-surface-tint active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-3 text-sm uppercase tracking-widest shadow-[0_8px_32px_rgba(0,38,26,0.1)] cursor-pointer border-none"
              >
                <span className="material-symbols-outlined text-lg font-light">
                  shopping_cart
                </span>
                {labels.securePurchase}
              </button>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
