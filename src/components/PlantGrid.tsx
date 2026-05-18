"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPlants } from "../lib/db";
import { Plant } from "../lib/data";
import { PlantCard } from "./PlantCard";
import { PlantModal } from "./PlantModal";
import { useLanguage } from "../context/LanguageContext";

export const PlantGrid = () => {
  const [plantsList, setPlantsList] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  
  // Filtering & Sorting states
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLight, setSelectedLight] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Curated");

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

  // Translation helpers
  const getFilterLabels = () => {
    if (language === "si") {
      return {
        category: "කාණ්ඩය",
        lightLevel: "සූර්යාලෝක මට්ටම",
        all: "සියල්ල",
        rareFinds: "දුර්ලභ පැලෑටි",
        interiorStaples: "අභ්‍යන්තර අලංකරණ",
        brightIndirect: "දීප්තිමත් වක්‍ර ආලෝකය",
        mediumLight: "මධ්‍යම ආලෝකය",
        lowLight: "අඩු ආලෝකය",
        sortBy: "පිළිවෙල:",
        sortCurated: "තෝරාගත් මෝස්තර",
        sortLowHigh: "මිල: අඩු සිට වැඩි",
        sortHighLow: "මිල: වැඩි සිට අඩු",
        noPlants: "තෝරාගත් පෙරහන් වලට ගැළපෙන පැලෑටි කිසිවක් හමු නොවීය.",
        subheading: "නගරබද ජීවිතයට සොබාදහමේ සන්සුන් බව සහ සුන්දරත්වය ළඟා කර දීම සඳහා විශේෂයෙන් තෝරාගත් අලංකාරවත් ශාක එකතුව.",
      };
    }
    return {
      category: "Category",
      lightLevel: "Light Level",
      all: "All",
      rareFinds: "Rare Finds",
      interiorStaples: "Interior Staples",
      brightIndirect: "Bright Indirect",
      mediumLight: "Medium Light",
      lowLight: "Low Light Tolerant",
      sortBy: "Sort by:",
      sortCurated: "Curated",
      sortLowHigh: "Price: Low to High",
      sortHighLow: "Price: High to Low",
      noPlants: "No plants found matching the selected filters.",
      subheading: "Curated botanical specimens designed to elevate your living spaces with structural elegance and organic warmth.",
    };
  };

  const labels = getFilterLabels();

  // Filter logic
  const filteredPlants = plantsList.filter((plant) => {
    const categoryMatch =
      selectedCategory === "All" ||
      (plant.category && plant.category.includes(selectedCategory));

    let lightMatch = true;
    if (selectedLight !== "All") {
      const sunlightText = (plant.care?.sunlight || "").toLowerCase();
      if (selectedLight === "Bright Indirect") {
        lightMatch = sunlightText.includes("bright") || sunlightText.includes("indirect");
      } else if (selectedLight === "Medium Light") {
        lightMatch = sunlightText.includes("medium");
      } else if (selectedLight === "Low Light Tolerant") {
        lightMatch =
          sunlightText.includes("low") ||
          sunlightText.includes("adaptable") ||
          sunlightText.includes("completely");
      }
    }

    return categoryMatch && lightMatch;
  });

  // Sort logic
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    if (sortBy === "LowToHigh") {
      return a.price - b.price;
    }
    if (sortBy === "HighToLow") {
      return b.price - a.price;
    }
    return 0; // Default curated order
  });

  return (
    <section id="collection" className="py-section-gap w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative">
      {/* Minimalist Page Header */}
      <header className="py-16 md:py-24 text-center flex flex-col items-center">
        <h2 className="font-serif text-display-lg-mobile md:text-display-lg text-primary mb-4">
          {t("ourCollection")}
        </h2>
        <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-light">
          {labels.subheading}
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-margin-desktop items-start">
          {/* Sidebar: Premium Filtering (Desktop mostly) */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-32 space-y-12">
            {/* Filter Group: Category */}
            <div className="border-b border-surface-variant pb-8">
              <h3 className="font-sans text-label-md uppercase tracking-widest text-primary font-semibold mb-6">
                {labels.category}
              </h3>
              <ul className="space-y-4 font-sans text-body-md text-on-surface-variant font-light">
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === "All"}
                      onChange={() => setSelectedCategory("All")}
                      className="form-checkbox h-4.5 w-4.5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-background bg-transparent transition-colors cursor-pointer"
                    />
                    <span className={`group-hover:text-primary transition-colors ${selectedCategory === "All" ? "text-primary font-medium" : ""}`}>
                      {labels.all}
                    </span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === "Rare Finds"}
                      onChange={() => setSelectedCategory("Rare Finds")}
                      className="form-checkbox h-4.5 w-4.5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-background bg-transparent transition-colors cursor-pointer"
                    />
                    <span className={`group-hover:text-primary transition-colors ${selectedCategory === "Rare Finds" ? "text-primary font-medium" : ""}`}>
                      {labels.rareFinds}
                    </span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === "Interior Staples"}
                      onChange={() => setSelectedCategory("Interior Staples")}
                      className="form-checkbox h-4.5 w-4.5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-background bg-transparent transition-colors cursor-pointer"
                    />
                    <span className={`group-hover:text-primary transition-colors ${selectedCategory === "Interior Staples" ? "text-primary font-medium" : ""}`}>
                      {labels.interiorStaples}
                    </span>
                  </label>
                </li>
              </ul>
            </div>

            {/* Filter Group: Light Level */}
            <div>
              <h3 className="font-sans text-label-md uppercase tracking-widest text-primary font-semibold mb-6">
                {labels.lightLevel}
              </h3>
              <ul className="space-y-4 font-sans text-body-md text-on-surface-variant font-light">
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLight === "All"}
                      onChange={() => setSelectedLight("All")}
                      className="form-checkbox h-4.5 w-4.5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-background bg-transparent transition-colors cursor-pointer"
                    />
                    <span className={`group-hover:text-primary transition-colors ${selectedLight === "All" ? "text-primary font-medium" : ""}`}>
                      {labels.all}
                    </span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLight === "Bright Indirect"}
                      onChange={() => setSelectedLight("Bright Indirect")}
                      className="form-checkbox h-4.5 w-4.5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-background bg-transparent transition-colors cursor-pointer"
                    />
                    <span className={`group-hover:text-primary transition-colors ${selectedLight === "Bright Indirect" ? "text-primary font-medium" : ""}`}>
                      {labels.brightIndirect}
                    </span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLight === "Medium Light"}
                      onChange={() => setSelectedLight("Medium Light")}
                      className="form-checkbox h-4.5 w-4.5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-background bg-transparent transition-colors cursor-pointer"
                    />
                    <span className={`group-hover:text-primary transition-colors ${selectedLight === "Medium Light" ? "text-primary font-medium" : ""}`}>
                      {labels.mediumLight}
                    </span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLight === "Low Light Tolerant"}
                      onChange={() => setSelectedLight("Low Light Tolerant")}
                      className="form-checkbox h-4.5 w-4.5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-background bg-transparent transition-colors cursor-pointer"
                    />
                    <span className={`group-hover:text-primary transition-colors ${selectedLight === "Low Light Tolerant" ? "text-primary font-medium" : ""}`}>
                      {labels.lowLight}
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Product Area */}
          <div className="flex-1 w-full">
            {/* Mobile/Top Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 border-b border-outline-variant/10 pb-6">
              {/* Category Chips scrollable (Mobile friendly) */}
              <div className="flex gap-3 overflow-x-auto scrollbar-none w-full sm:w-auto pb-2 sm:pb-0">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-5 py-2 rounded-full font-sans text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    selectedCategory === "All"
                      ? "bg-primary text-white shadow-md"
                      : "bg-surface-container-low border border-outline-variant/30 text-primary hover:bg-surface-container-high"
                  }`}
                >
                  {labels.all}
                </button>
                <button
                  onClick={() => setSelectedCategory("Rare Finds")}
                  className={`px-5 py-2 rounded-full font-sans text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    selectedCategory === "Rare Finds"
                      ? "bg-primary text-white shadow-md"
                      : "bg-surface-container-low border border-outline-variant/30 text-primary hover:bg-surface-container-high"
                  }`}
                >
                  {labels.rareFinds}
                </button>
                <button
                  onClick={() => setSelectedCategory("Interior Staples")}
                  className={`px-5 py-2 rounded-full font-sans text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    selectedCategory === "Interior Staples"
                      ? "bg-primary text-white shadow-md"
                      : "bg-surface-container-low border border-outline-variant/30 text-primary hover:bg-surface-container-high"
                  }`}
                >
                  {labels.interiorStaples}
                </button>
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-3 text-on-surface-variant font-sans text-xs uppercase tracking-widest shrink-0 w-full sm:w-auto justify-end font-semibold">
                <span className="font-light">{labels.sortBy}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-primary font-semibold focus:ring-0 cursor-pointer uppercase py-1 pr-8 pl-0 text-xs hover:text-surface-tint transition-colors"
                >
                  <option value="Curated">{labels.sortCurated}</option>
                  <option value="LowToHigh">{labels.sortLowHigh}</option>
                  <option value="HighToLow">{labels.sortHighLow}</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              {sortedPlants.length === 0 ? (
                <motion.div
                  key="no-plants"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-on-surface-variant font-sans py-20 font-light"
                >
                  {labels.noPlants}
                </motion.div>
              ) : (
                <motion.div
                  key="plants-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter"
                >
                  {sortedPlants.map((plant) => (
                    <PlantCard
                      key={plant.id}
                      plant={plant}
                      onClick={() => setSelectedPlant(plant)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
