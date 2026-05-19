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
      curatedBotanicals: "Curated Botanicals",
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
    hidden: { opacity: 0, y: 50, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
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
            className="text-headline-lg font-serif text-primary mb-3"
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
          className="hidden md:flex items-center text-label-sm font-sans uppercase tracking-widest text-primary hover:opacity-80 transition-opacity gap-2 group"
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
                className="md:col-span-8 group relative rounded-2xl overflow-hidden glass-panel flex flex-col md:flex-row shadow-[0_4px_40px_rgba(0,38,26,0.06)] hover:shadow-[0_20px_70px_rgba(0,38,26,0.14)] transition-shadow duration-700 cursor-pointer"
                onClick={() => setSelectedPlant(largePlant)}
              >
                {/* Image with Ken Burns effect */}
                <div className="w-full md:w-1/2 h-[300px] md:h-[500px] relative overflow-hidden bg-surface-container">
                  <motion.img
                    src={largePlant.images[0] || "/placeholder.jpg"}
                    alt={largePlant.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Subtle image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {largePlant.isSold && (
                    <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl border border-white/10">
                      Sold Out
                    </div>
                  )}
                </div>

                {/* Info panel - NO category tag */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                  {/* Decorative corner accent */}
                  <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-primary/10 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <h3 className="text-headline-md font-serif text-primary mb-4">
                    {largePlant.name}
                  </h3>

                  <p className="text-body-md font-sans text-on-surface-variant mb-8 line-clamp-3 font-light leading-relaxed">
                    {largePlant.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-body-lg font-sans text-primary font-semibold">
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
                          : "border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary cursor-pointer"
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
                  </div>
                </div>
              </motion.div>
            );

            const smallCardsCol = smallPlants.length > 0 && (
              <div className="md:col-span-4 flex flex-col gap-gutter">
                {smallPlants.map((plant) => (
                  <motion.div
                    key={plant.id}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex-1 group relative rounded-2xl overflow-hidden glass-panel shadow-[0_4px_40px_rgba(0,38,26,0.06)] hover:shadow-[0_20px_70px_rgba(0,38,26,0.14)] transition-shadow duration-700 cursor-pointer flex flex-col"
                    onClick={() => setSelectedPlant(plant)}
                  >
                    {/* Image with zoom */}
                    <div className="h-[250px] relative overflow-hidden bg-surface-container shrink-0">
                      <motion.img
                        src={plant.images[0] || "/placeholder.jpg"}
                        alt={plant.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                      {/* Overlay gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {plant.isSold && (
                        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg border border-white/10">
                          Sold Out
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col grow justify-between">
                      <h4 className="text-body-lg font-serif text-primary font-medium mb-2">
                        {plant.name}
                      </h4>
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`text-body-md font-sans font-light ${plant.isSold ? "text-on-surface-variant/50 line-through" : "text-on-surface-variant"}`}>
                          Rs. {plant.price.toLocaleString()}
                        </span>
                        <motion.span
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.85 }}
                          className="material-symbols-outlined text-outline-variant hover:text-primary transition-colors cursor-pointer"
                        >
                          favorite
                        </motion.span>
                      </div>
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
                className="grid grid-cols-1 md:grid-cols-12 gap-gutter"
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
