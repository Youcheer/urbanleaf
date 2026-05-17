"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPlants } from "../lib/db";
import { Plant } from "../lib/data";
import { PlantCard } from "./PlantCard";
import { PlantModal } from "./PlantModal";
import { useLanguage } from "../context/LanguageContext";

export const PlantGrid = () => {
  const [plantsList, setPlantsList] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const { t } = useLanguage();

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

  return (
    <section id="collection" className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-playfair text-4xl md:text-5xl font-bold text-[#1a4a28]"
        >
          {t("ourCollection")}
        </motion.h2>
        <div className="w-24 h-1 bg-[#3b8554] mx-auto mt-4 rounded-full" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4a28]"></div>
        </div>
      ) : plantsList.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No plants found in collection.
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plantsList.map((plant) => (
            <PlantCard 
              key={plant.id} 
              plant={plant} 
              onClick={() => setSelectedPlant(plant)}
            />
          ))}
        </motion.div>
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
