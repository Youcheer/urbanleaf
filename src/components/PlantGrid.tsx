"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPlants } from "../lib/db";
import { Plant } from "../lib/data";
import { PlantCard } from "./PlantCard";
import { PlantModal } from "./PlantModal";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export const PlantGrid = () => {
  const [plantsList, setPlantsList] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const { language, t } = useLanguage();
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

  const featuredPlant = plantsList[0];
  const secondPlant = plantsList[1];
  const remainingPlants = plantsList.slice(2);

  const getSubheading = () => {
    return language === "en"
      ? "Exceptional specimens for the modern interior."
      : "නවීන අභ්‍යන්තරය සඳහා සුවිශේෂී ශාක වර්ග.";
  };

  const getSignatureLabel = () => {
    return language === "en" ? "Signature Collection" : "විශේෂ එකතුව";
  };

  return (
    <section id="collection" className="py-section-gap w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative">
      {/* Grid Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-headline-lg font-serif text-primary mb-2">
            {t("ourCollection")}
          </h2>
          <p className="text-body-md font-sans text-on-surface-variant">
            {getSubheading()}
          </p>
        </motion.div>
        <div className="w-16 h-[1px] bg-primary md:hidden" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : plantsList.length === 0 ? (
        <div className="text-center text-on-surface-variant font-sans py-12">
          {language === "en" ? "No plants found in collection." : "භාණ්ඩ කිසිවක් හමු නොවීය."}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Asymmetrical Featured Bento Grid (for Crimson Anthurium and Monstera Albo) */}
          {featuredPlant && secondPlant && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Large Feature Card (left) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="md:col-span-8 group relative rounded-xl overflow-hidden glass-panel flex flex-col md:flex-row shadow-[0_4px_40px_rgba(0,38,26,0.06)] hover:shadow-[0_12px_60px_rgba(0,38,26,0.12)] hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedPlant(featuredPlant)}
              >
                {/* Image Container */}
                <div className="w-full md:w-1/2 h-[320px] md:h-[500px] relative overflow-hidden bg-surface-container">
                  <img
                    alt={featuredPlant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src={featuredPlant.images && featuredPlant.images.length > 0 ? featuredPlant.images[0] : featuredPlant.image}
                  />
                </div>
                
                {/* Details Container */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary-container/50 text-primary text-label-sm font-sans font-semibold uppercase tracking-widest mb-6 w-max">
                    {getSignatureLabel()}
                  </div>
                  <h3 className="text-headline-md font-serif text-primary mb-4">
                    {featuredPlant.name}
                  </h3>
                  <p className="text-body-md font-sans text-on-surface-variant mb-8 line-clamp-3 leading-relaxed">
                    {featuredPlant.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-body-lg font-sans text-primary font-semibold">
                      LKR {featuredPlant.price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(featuredPlant);
                      }}
                      className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white active:scale-95 transition-all duration-300"
                    >
                      <span className="material-symbols-outlined font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                        add
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Smaller Card (right) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="md:col-span-4 group relative rounded-xl overflow-hidden glass-panel flex flex-col shadow-[0_4px_40px_rgba(0,38,26,0.06)] hover:shadow-[0_12px_60px_rgba(0,38,26,0.12)] hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedPlant(secondPlant)}
              >
                {/* Image Container */}
                <div className="h-[300px] md:h-[350px] relative overflow-hidden bg-surface-container">
                  <img
                    alt={secondPlant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src={secondPlant.images && secondPlant.images.length > 0 ? secondPlant.images[0] : secondPlant.image}
                  />
                </div>
                
                {/* Details Container */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h4 className="text-body-lg font-serif text-primary font-semibold mb-2">
                      {secondPlant.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-body-md font-sans text-on-surface-variant font-semibold">
                      LKR {secondPlant.price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(secondPlant);
                      }}
                      className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white active:scale-95 transition-all duration-300"
                    >
                      <span className="material-symbols-outlined font-light text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>
                        add
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Catalog Grid for remaining items */}
          {remainingPlants.length > 0 && (
            <div className="pt-12">
              <div className="w-full h-[1px] bg-outline-variant/30 mb-12" />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
              >
                {remainingPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    onClick={() => setSelectedPlant(plant)}
                  />
                ))}
              </motion.div>
            </div>
          )}
          
          {/* Fallback to simple grid in case of fewer than 2 plants */}
          {plantsList.length < 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {plantsList.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  onClick={() => setSelectedPlant(plant)}
                />
              ))}
            </div>
          )}
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
