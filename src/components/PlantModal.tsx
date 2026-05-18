"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plant } from "../lib/data";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export const PlantModal = ({ plant, onClose }: { plant: Plant; onClose: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<"care" | "shipping" | null>("care"); // Care guide open by default

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
        botanicalCollection: "BOTANICAL COLLECTION",
        freeShippingText: "Complimentary nationwide overnight shipping included.",
        careGuide: "Care Guide",
        shippingReturns: "Shipping & Returns",
        securePurchase: "SECURE PURCHASE",
        shippingDetails: "නොමිලේ දිවයින පුරා එදිනම ශීතකරණ පහසුකම් සහිත විශේෂිත කුරියර් සේවාව මඟින් බෙදා හැරීම සිදු කෙරේ. පැළෑටිවල නැවුම් බව සහ ප්‍රකෘතිමත්භාවය උපරිමයෙන් ආරක්ෂා වන සේ ඉතා ප්‍රවේශමෙන් ඇසුරුම් කරනු ලැබේ. කිසියම් හානියක් සිදුවුවහොත් දින 7ක් ඇතුළත ආපසු භාරගෙන නව පැළයක් හෝ මුදල් ආපසු ලබාදේ.",
      };
    }
    return {
      rareCollection: "RARE COLLECTION",
      botanicalCollection: "BOTANICAL COLLECTION",
      freeShippingText: "Complimentary nationwide overnight shipping included.",
      careGuide: "Care Guide",
      shippingReturns: "Shipping & Returns",
      securePurchase: "SECURE PURCHASE",
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
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#00261a] rounded-[1.5rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh] border border-white/10"
        >
          {/* Circular Outline Close Button from Screenshot */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-[#00261a]/60 backdrop-blur-sm w-10 h-10 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined block text-[20px] font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
              close
            </span>
          </button>

          {/* Left: Premium Full Height Image Gallery */}
          <div className="w-full md:w-1/2 relative bg-[#001710] min-h-[40vh] md:min-h-full overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                src={images[currentImage]}
                alt={plant.name}
                className="w-full h-full absolute inset-0 object-cover object-center"
              />
            </AnimatePresence>

            {/* Left/Right Chevrons from Screenshot */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#001c13]/60 hover:bg-[#001c13] text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined block text-lg font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#001c13]/60 hover:bg-[#001c13] text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined block text-lg font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chevron_right
                  </span>
                </button>

                {/* Round dots indicator at the bottom */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        currentImage === idx ? "bg-white scale-125" : "bg-white/45"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Solid Deep Forest Green Info Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col bg-[#00261a] max-h-[90vh] text-white scrollbar-thin">
            
            {/* Headline tag & names */}
            <div className="mb-2">
              <span className="inline-block px-4 py-1.5 bg-[#173827] text-[#86b98d] font-sans text-[10px] font-semibold rounded-full tracking-widest uppercase mb-4 border border-[#86b98d]/20">
                {tag}
              </span>
              <h2 className="font-serif text-3xl md:text-[38px] font-bold text-white mb-2 leading-tight uppercase tracking-wide">
                {plant.name}
              </h2>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-2" />

            {/* Pricing block */}
            <div className="py-2">
              <p className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide">
                LKR {plant.price.toLocaleString()}
              </p>
              <p className="text-[11px] font-sans text-[#86b98d]/50 mt-1.5 tracking-wide font-light">
                {labels.freeShippingText}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-2" />

            {/* Description from screenshot */}
            <div className="my-4">
              <p className="text-white/80 font-sans text-sm leading-relaxed font-light">
                {plant.description}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-2" />

            {/* Care Guide & Shipping Accordions */}
            <div className="mb-6">
              
              {/* Accordion: Care Guide */}
              <div className="border-b border-white/10 py-3.5">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
                  className="w-full flex justify-between items-center text-left cursor-pointer border-none bg-transparent p-0 focus:outline-none"
                >
                  <h3 className="font-serif text-white text-lg font-medium transition-transform duration-300">
                    {labels.careGuide}
                  </h3>
                  <span className={`material-symbols-outlined text-white transition-transform duration-300 ${activeAccordion === "care" ? "rotate-180" : ""}`}>
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
                      <div className="pt-4 space-y-4 font-sans text-xs">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/80 shrink-0">
                            <span className="material-symbols-outlined text-base">sunny</span>
                          </div>
                          <div>
                            <span className="font-bold text-white uppercase tracking-wider block text-[9px]">SUNLIGHT</span>
                            <span className="text-white/70 font-light text-xs">{plant.care.sunlight}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/80 shrink-0">
                            <span className="material-symbols-outlined text-base">water_drop</span>
                          </div>
                          <div>
                            <span className="font-bold text-white uppercase tracking-wider block text-[9px]">WATERING</span>
                            <span className="text-white/70 font-light text-xs">{plant.care.watering}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/80 shrink-0">
                            <span className="material-symbols-outlined text-base">thermostat</span>
                          </div>
                          <div>
                            <span className="font-bold text-white uppercase tracking-wider block text-[9px]">ENVIRONMENT</span>
                            <span className="text-white/70 font-light text-xs">{plant.care.environment}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion: Shipping & Returns */}
              <div className="border-b border-white/10 py-3.5">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
                  className="w-full flex justify-between items-center text-left cursor-pointer border-none bg-transparent p-0 focus:outline-none"
                >
                  <h3 className="font-serif text-white text-lg font-medium transition-transform duration-300">
                    {labels.shippingReturns}
                  </h3>
                  <span className={`material-symbols-outlined text-white transition-transform duration-300 ${activeAccordion === "shipping" ? "rotate-180" : ""}`}>
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
                      <div className="pt-4 text-xs font-sans text-white/70 leading-relaxed font-light">
                        {labels.shippingDetails}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* SECURE PURCHASE Button from Screenshot */}
            <div className="mt-auto pt-2">
              <button
                onClick={() => {
                  addToCart(plant);
                  onClose();
                }}
                className="w-full bg-[#00170f] hover:bg-[#002d1a] border border-white/15 text-white py-4 rounded-default font-sans font-bold hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-3 text-[12px] uppercase tracking-[0.1em] shadow-[0_8px_32px_rgba(0,0,0,0.15)] cursor-pointer"
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
