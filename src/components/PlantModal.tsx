"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plant } from "../lib/data";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const AUTO_SLIDE_INTERVAL = 4000; // 4 seconds per image

export const PlantModal = ({ plant, onClose }: { plant: Plant; onClose: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [activeAccordion, setActiveAccordion] = useState<"care" | "shipping" | null>("care"); // Care guide open by default
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { addToCart } = useCart();
  const { language } = useLanguage();

  const images = plant.images && plant.images.length > 0 ? plant.images : (plant.image ? [plant.image] : []);
  const imageCount = images.length;

  // Auto-slide images
  useEffect(() => {
    if (!isAutoPlaying || imageCount <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImage((prev) => (prev + 1) % imageCount);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, imageCount, currentImage]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleNext = () => {
    pauseAutoPlay();
    setDirection(1);
    setCurrentImage((prev) => (prev + 1) % imageCount);
  };

  const handlePrev = () => {
    pauseAutoPlay();
    setDirection(-1);
    setCurrentImage((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const handleDotClick = (idx: number) => {
    pauseAutoPlay();
    setDirection(idx > currentImage ? 1 : -1);
    setCurrentImage(idx);
  };

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  // Translation helpers
  const getModalTranslations = () => {
    if (language === "si") {
      return {
        rareCollection: "දුර්ලභ එකතුව",
        botanicalCollection: "PREMIUM PLANTS",
        freeShippingText: "Complimentary nationwide overnight shipping included.",
        careGuide: "Care Guide",
        shippingReturns: "Shipping & Returns",
        securePurchase: "SECURE PURCHASE",
        shippingDetails: "නොමිලේ දිවයින පුරා එදිනම ශීතකරණ පහසුකම් සහිත විශේෂිත කුරියර් සේවාව මඟින් බෙදා හැරීම සිදු කෙරේ. පැළෑටිවල නැවුම් බව සහ ප්‍රකෘතිමත්භාවය උපරිමයෙන් ආරක්ෂා වන සේ ඉතා ප්‍රවේශමෙන් ඇසුරුම් කරනු ලැබේ. කිසියම් හානියක් සිදුවුවහොත් දින 7ක් ඇතුළත ආපසු භාරගෙන නව පැළයක් හෝ මුදල් ආපසු ලබාදේ.",
      };
    }
    return {
      rareCollection: "RARE COLLECTION",
      botanicalCollection: "PREMIUM PLANTS",
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
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#f7faf7] rounded-[var(--radius-leaf)] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh] border-t-4 border-t-[var(--color-accent)] border-[#002115]/10"
        >
          {/* Circular Outline Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-[#f7faf7]/85 backdrop-blur-sm w-10 h-10 rounded-[var(--radius-full)] border border-[#002115]/10 text-[#002115]/70 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined block text-[20px] font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
              close
            </span>
          </button>

          {/* Left: Premium Full Height Image Gallery with Auto-Slide */}
          <div className="w-full md:w-1/2 relative bg-[#ecefec] min-h-[40vh] md:min-h-full overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentImage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                src={images[currentImage]}
                alt={plant.name}
                className="w-full h-full absolute inset-0 object-cover object-center"
              />
            </AnimatePresence>

            {/* Auto-slide progress bar */}
            {imageCount > 1 && isAutoPlaying && (
              <div className="absolute top-0 left-0 right-0 h-[3px] z-20 bg-[#002115]/10">
                <motion.div
                  key={`progress-${currentImage}`}
                  className="h-full bg-[#002115]/40"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTO_SLIDE_INTERVAL / 1000, ease: "linear" }}
                />
              </div>
            )}

            {/* Left/Right Chevrons */}
            {imageCount > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#002115] w-10 h-10 rounded-full flex items-center justify-center border border-[#002115]/10 active:scale-90 transition-all cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined block text-lg font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#002115] w-10 h-10 rounded-full flex items-center justify-center border border-[#002115]/10 active:scale-90 transition-all cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined block text-lg font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chevron_right
                  </span>
                </button>

                {/* Round dots indicator with active pill */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      className={`rounded-full transition-all duration-500 cursor-pointer ${
                        currentImage === idx
                          ? "bg-[var(--color-accent)] w-6 h-2.5 shadow-[0_0_8px_rgba(212,63,94,0.3)]"
                          : "bg-[#002115]/30 w-2.5 h-2.5 hover:bg-[var(--color-accent)]/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Premium Light Cream Info Panel */}
          <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto flex flex-col bg-[#f7faf7] max-h-[90vh] text-[#002115] scrollbar-thin">
            
            {/* Headline tag & names */}
            <div className="mb-2">
              <span className="inline-block px-4 py-1.5 bg-[var(--color-accent-container)] text-[var(--color-on-accent-container)] font-sans text-[10px] font-semibold rounded-[var(--radius-leaf)] tracking-widest uppercase mb-4 border border-[var(--color-accent)]/15">
                {tag}
              </span>
              {plant.isSold && (
                <span className="inline-block ml-3 px-4 py-1.5 bg-[#002115] text-white font-sans text-[10px] font-bold rounded-full tracking-widest uppercase mb-4 shadow-sm">
                  SOLD OUT
                </span>
              )}
              <h2 className="font-serif text-3xl md:text-[38px] font-bold text-[var(--color-primary)] mb-2 leading-tight uppercase tracking-wide">
                {plant.name}
              </h2>
            </div>

            {/* Divider */}
            <div className="border-t border-[#002115]/10 my-2" />

            {/* Pricing block */}
            <div className="py-2">
              <p className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-accent)] tracking-wide">
                LKR {plant.price.toLocaleString()}
              </p>
              <p className="text-[11px] font-sans text-[#002115]/60 mt-1.5 tracking-wide font-light">
                {labels.freeShippingText}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-[#002115]/10 my-2" />

            {/* Description */}
            <div className="my-4">
              <p className="text-[#002115]/80 font-sans text-sm leading-relaxed font-light">
                {plant.description}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-[#002115]/10 my-2" />

            {/* Care Guide & Shipping Accordions */}
            <div className="mb-6">
              
              {/* Accordion: Care Guide */}
              <div className="border-b border-[#002115]/10 py-3.5">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
                  className="w-full flex justify-between items-center text-left cursor-pointer border-none bg-transparent p-0 focus:outline-none"
                >
                  <h3 className="font-serif text-[#002115] text-lg font-medium transition-transform duration-300 hover:text-[var(--color-accent)]">
                    {labels.careGuide}
                  </h3>
                  <span className={`material-symbols-outlined text-[#002115] transition-transform duration-300 ${activeAccordion === "care" ? "rotate-180" : ""}`}>
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
                      <div className="pt-4 space-y-4 font-sans text-xs pb-2">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-[var(--radius-leaf)] border border-[#002115]/15 flex items-center justify-center text-[var(--color-accent)] shrink-0 bg-[var(--color-accent-container)]">
                            <span className="material-symbols-outlined text-base">sunny</span>
                          </div>
                          <div>
                            <span className="font-bold text-[#002115] uppercase tracking-wider block text-[9px]">SUNLIGHT</span>
                            <span className="text-[#002115]/80 font-light text-xs">{plant.care.sunlight}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-[var(--radius-leaf)] border border-[#002115]/15 flex items-center justify-center text-[var(--color-accent)] shrink-0 bg-[var(--color-accent-container)]">
                            <span className="material-symbols-outlined text-base">water_drop</span>
                          </div>
                          <div>
                            <span className="font-bold text-[#002115] uppercase tracking-wider block text-[9px]">WATERING</span>
                            <span className="text-[#002115]/80 font-light text-xs">{plant.care.watering}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-[var(--radius-leaf)] border border-[#002115]/15 flex items-center justify-center text-[var(--color-accent)] shrink-0 bg-[var(--color-accent-container)]">
                            <span className="material-symbols-outlined text-base">thermostat</span>
                          </div>
                          <div>
                            <span className="font-bold text-[#002115] uppercase tracking-wider block text-[9px]">ENVIRONMENT</span>
                            <span className="text-[#002115]/80 font-light text-xs">{plant.care.environment}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion: Shipping & Returns */}
              <div className="border-b border-[#002115]/10 py-3.5">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
                  className="w-full flex justify-between items-center text-left cursor-pointer border-none bg-transparent p-0 focus:outline-none"
                >
                  <h3 className="font-serif text-[#002115] text-lg font-medium transition-transform duration-300 hover:text-[var(--color-accent)]">
                    {labels.shippingReturns}
                  </h3>
                  <span className={`material-symbols-outlined text-[#002115] transition-transform duration-300 ${activeAccordion === "shipping" ? "rotate-180" : ""}`}>
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
                      <div className="pt-4 pb-2 text-xs font-sans text-[#002115]/80 leading-relaxed font-light">
                        {labels.shippingDetails}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* SECURE PURCHASE Button */}
            <div className="mt-auto pt-2 pb-6 md:pb-0">
              <button
                disabled={plant.isSold}
                onClick={() => {
                  if (!plant.isSold) {
                    addToCart(plant);
                    onClose();
                  }
                }}
                className={`w-full py-4 rounded-[var(--radius-leaf-reverse)] font-sans font-bold transition-all duration-300 flex justify-center items-center gap-3 text-[12px] uppercase tracking-[0.1em] border-none ${
                  plant.isSold
                    ? "bg-[#002115]/10 text-[#002115]/40 cursor-not-allowed"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white hover:scale-[1.01] active:scale-[0.98] shadow-[0_8px_32px_rgba(0,33,20,0.12)] cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-lg font-light">
                  {plant.isSold ? "block" : "shopping_cart"}
                </span>
                {plant.isSold ? "Sold Out" : labels.securePurchase}
              </button>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
