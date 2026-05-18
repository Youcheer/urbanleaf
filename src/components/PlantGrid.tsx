"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPlants } from "../lib/db";
import { Plant } from "../lib/data";
import { PlantModal } from "./PlantModal";
import { useLanguage } from "../context/LanguageContext";

export const PlantGrid = () => {
  const [plantsList, setPlantsList] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const { language, t } = useLanguage();

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

  return (
    <section id="collection" className="py-section-gap w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-headline-lg font-serif text-primary mb-2">
            {labels.curatedBotanicals}
          </h2>
          <p className="text-body-md font-sans text-on-surface-variant font-light">
            {labels.subtext}
          </p>
        </div>
        <a
          className="hidden md:flex items-center text-label-sm font-sans uppercase tracking-widest text-primary hover:opacity-80 transition-opacity gap-2"
          href="#"
        >
          {labels.viewAll} <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {plantChunks.map((chunk, chunkIdx) => {
            const isEvenRow = chunkIdx % 2 === 0;

            const largePlant = chunk[0];
            const smallPlants = chunk.slice(1); // can be 1 or 2 items

            const largeCard = (
              <div
                className="md:col-span-8 group relative rounded-xl overflow-hidden glass-panel flex flex-col md:flex-row shadow-[0_4px_40px_rgba(0,38,26,0.06)] hover:shadow-[0_12px_60px_rgba(0,38,26,0.12)] hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedPlant(largePlant)}
              >
                <div className="w-full md:w-1/2 h-[300px] md:h-[500px] relative overflow-hidden bg-surface-container">
                  <img
                    src={largePlant.images[0] || "/placeholder.jpg"}
                    alt={largePlant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  {largePlant.category && largePlant.category[0] && (
                    <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-secondary-container/50 text-primary text-label-sm font-sans uppercase tracking-widest mb-6 w-max font-semibold">
                      {largePlant.category[0]}
                    </div>
                  )}
                  <h3 className="text-headline-md font-serif text-primary mb-4">
                    {largePlant.name}
                  </h3>
                  <p className="text-body-md font-sans text-on-surface-variant mb-8 line-clamp-3 font-light">
                    {largePlant.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-body-lg font-sans text-primary font-medium">
                      Rs. {largePlant.price.toLocaleString()}
                    </span>
                    <button className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white active:scale-95 transition-all duration-300">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
                    </button>
                  </div>
                </div>
              </div>
            );

            const smallCardsCol = smallPlants.length > 0 && (
              <div className="md:col-span-4 flex flex-col gap-gutter">
                {smallPlants.map((plant) => (
                  <div
                    key={plant.id}
                    className="flex-1 group relative rounded-xl overflow-hidden glass-panel shadow-[0_4px_40px_rgba(0,38,26,0.06)] hover:shadow-[0_12px_60px_rgba(0,38,26,0.12)] hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
                    onClick={() => setSelectedPlant(plant)}
                  >
                    <div className="h-[250px] relative overflow-hidden bg-surface-container shrink-0">
                      <img
                        src={plant.images[0] || "/placeholder.jpg"}
                        alt={plant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-6 flex flex-col grow justify-between">
                      <h4 className="text-body-lg font-serif text-primary font-medium mb-2">
                        {plant.name}
                      </h4>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-body-md font-sans text-on-surface-variant font-light">
                          Rs. {plant.price.toLocaleString()}
                        </span>
                        <span className="material-symbols-outlined text-outline-variant hover:text-primary hover:scale-110 active:scale-95 transition-all cursor-pointer">
                          favorite
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );

            return (
              <motion.div
                key={chunkIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
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
