"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPlants } from "../lib/db";
import { Plant } from "../lib/data";
import { PlantCard } from "./PlantCard";

const categories = ["All", "Indoor Spaces", "Low Maintenance", "Office"];

export const PlantGrid = () => {
  const [plantsList, setPlantsList] = useState<Plant[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

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

  const filteredPlants = plantsList.filter((plant) => 
    activeCategory === "All" ? true : plant.category.includes(activeCategory)
  );

  return (
    <section id="collection" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-playfair text-4xl md:text-5xl font-bold text-[#1a4a28] mb-6"
        >
          Our Collection
        </motion.h2>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#1a4a28] text-white shadow-lg"
                  : "bg-white text-[#1a4a28] hover:bg-[#e2e8e4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4a28]"></div>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </motion.div>
      )}
    </section>
  );
};
