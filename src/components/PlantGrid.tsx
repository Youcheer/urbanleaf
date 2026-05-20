"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPlants } from "../lib/db";
import { Plant } from "../lib/data";
import { PlantModal } from "./PlantModal";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export const PlantGrid = () => {
  const [plantsList, setPlantsList] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const { language } = useLanguage();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getPlants();
        setPlantsList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const getFilterLabels = () => {
    if (language === "si") {
      return {
        viewAll: "සියල්ල බලන්න",
        curatedBotanicals: "සුවිශේෂී පැලෑටි එකතුව",
        subtext: "ඔබේ අභ්‍යන්තර අලංකරණය සඳහා තෝරාගත් අලංකාරවත් ශාක.",
        add: "එකතු කරන්න",
      };
    }
    return {
      viewAll: "View All",
      curatedBotanicals: "Premium Collection",
      subtext: "Exceptional specimens for the modern interior.",
      add: "Add to Cart",
    };
  };

  const labels = getFilterLabels();

  // Helper to chunk array into groups of 3
  const chunkArray = (arr: Plant[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const plantChunks = chunkArray(plantsList, 3);

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 120, scale: 0.92, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="collection"
      className="relative py-section-gap w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop overflow-hidden"
    >
      {/* Premium Animated Section Header */}
      <div className="relative flex justify-between items-end mb-16 z-10">
        <div className="relative">
          {/* Decorative accent line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-[2px] bg-gradient-to-r from-primary to-primary/30 mb-4"
          />

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-headline-lg font-serif text-primary dark:text-on-surface mb-3"
          >
            {labels.curatedBotanicals}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-body-md font-sans text-on-surface-variant font-light"
          >
            {labels.subtext}
          </motion.p>

          {/* Animated underline glow */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-primary/40 via-primary/15 to-transparent origin-left"
          />
        </div>

        <motion.a
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:flex items-center text-label-sm font-sans uppercase tracking-widest text-primary dark:text-on-surface hover:opacity-80 transition-opacity gap-2 group"
          href="#"
        >
          {labels.viewAll}
          <motion.span
            className="material-symbols-outlined text-sm"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            arrow_forward
          </motion.span>
        </motion.a>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-16 relative z-10">
          {plantChunks.map((chunk, chunkIdx) => {
            const isEvenRow = chunkIdx % 2 === 0;

            const largePlant = chunk[0];
            const smallPlants = chunk.slice(1);

            const largeCard = (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="md:col-span-8 group relative rounded-[var(--radius-leaf)] overflow-hidden bg-white dark:bg-[#0c1810] flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,38,26,0.1)] transition-all duration-700 cursor-pointer border-t-2 border-t-[var(--color-accent)] border border-[#002115]/5 dark:border-white/5"
                onClick={() => setSelectedPlant(largePlant)}
              >
                {/* Image with Ken Burns effect */}
                <div className="w-full md:w-3/5 h-[400px] md:h-[600px] relative overflow-hidden bg-surface-container shrink-0">
                  <motion.img
                    src={largePlant.images[0] || "/placeholder.jpg"}
                    alt={largePlant.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
                  />
                  {/* Subtle image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {largePlant.isSold && (
                    <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl border border-white/10">
                      Sold Out
                    </div>
                  )}
                </div>

                {/* Info panel */}
                <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-center relative bg-white dark:bg-transparent">
                  {/* Decorative corner accent */}
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[var(--color-accent)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <motion.h3 variants={itemVariants} className="text-[28px] md:text-[36px] leading-tight font-serif text-[var(--color-primary)] dark:text-on-surface mb-6 hover:text-[var(--color-accent)] transition-colors duration-300">
                    {largePlant.name}
                  </motion.h3>

                  <motion.p variants={itemVariants} className="text-sm md:text-base font-sans text-on-surface-variant mb-10 line-clamp-4 font-light leading-relaxed">
                    {largePlant.description}
                  </motion.p>

                  <motion.div variants={itemVariants} className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[22px] font-sans text-[var(--color-accent)] font-semibold tracking-wide">
                        Rs. {largePlant.price.toLocaleString()}
                      </span>
                    </div>
                    <motion.button
                      disabled={largePlant.isSold}
                      whileHover={!largePlant.isSold ? { scale: 1.08, rotate: 90 } : {}}
                      whileTap={!largePlant.isSold ? { scale: 0.92 } : {}}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                        largePlant.isSold 
                          ? "border-outline-variant/30 text-outline-variant cursor-not-allowed" 
                          : "border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] cursor-pointer"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!largePlant.isSold) addToCart(largePlant);
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                        {largePlant.isSold ? "block" : "add"}
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            );

            const smallCardsCol = smallPlants.length > 0 && (
              <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
                {smallPlants.map((plant) => (
                  <motion.div
                    key={plant.id}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex-1 group relative rounded-[var(--radius-leaf-reverse)] overflow-hidden bg-white dark:bg-[#0c1810] shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,38,26,0.1)] transition-all duration-700 cursor-pointer flex flex-col border-t-2 border-t-[var(--color-accent)] border border-[#002115]/5 dark:border-white/5"
                    onClick={() => setSelectedPlant(plant)}
                  >
                    {/* Image with zoom */}
                    <div className="h-[280px] md:h-[320px] relative overflow-hidden bg-surface-container shrink-0">
                      <motion.img
                        src={plant.images[0] || "/placeholder.jpg"}
                        alt={plant.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.12 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                      />
                      {/* Overlay gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {plant.isSold && (
                        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg border border-white/10">
                          Sold Out
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col grow justify-between bg-white dark:bg-transparent">
                      <motion.h4 variants={itemVariants} className="text-[22px] font-serif text-primary dark:text-on-surface font-semibold mb-3 leading-tight">
                        {plant.name}
                      </motion.h4>
                      <motion.div variants={itemVariants} className="flex items-center justify-between mt-auto">
                        <span className={`text-[18px] font-sans font-medium tracking-wide ${plant.isSold ? "text-on-surface-variant/50 line-through" : "text-primary/90 dark:text-on-surface"}`}>
                          Rs. {plant.price.toLocaleString()}
                        </span>
                        <motion.span
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.85 }}
                          className="material-symbols-outlined text-outline-variant hover:text-primary transition-colors cursor-pointer"
                        >
                          favorite
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            );

            return (
              <motion.div
                key={chunkIdx}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
              >
                {isEvenRow ? (
                  <>
                    {largeCard}
                    {smallCardsCol}
                  </>
                ) : (
                  <>
                    {smallCardsCol}
                    {largeCard}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </section>
  );
};
