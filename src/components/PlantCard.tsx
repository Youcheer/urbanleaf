"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sun, Droplets, ThermometerSun } from "lucide-react";
import { Plant } from "../lib/data";
import { useCart } from "../context/CartContext";

export const PlantCard = ({ plant, onClick }: { plant: Plant; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const mainImage = plant.images && plant.images.length > 0 ? plant.images[0] : plant.image;

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 w-full overflow-hidden bg-gray-100">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
          src={mainImage}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
        
        {/* Care Instructions Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-center items-center gap-4 text-white p-6"
            >
              <div className="flex items-center gap-3 w-full max-w-[200px]">
                <Sun className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm">{plant.care.sunlight}</span>
              </div>
              <div className="flex items-center gap-3 w-full max-w-[200px]">
                <Droplets className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span className="text-sm">{plant.care.watering}</span>
              </div>
              <div className="flex items-center gap-3 w-full max-w-[200px]">
                <ThermometerSun className="w-5 h-5 text-orange-300 flex-shrink-0" />
                <span className="text-sm">{plant.care.environment}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(plant);
          }}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg text-[#1a4a28] hover:bg-[#1a4a28] hover:text-white transition-colors z-10"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <h3 className="font-playfair text-xl font-bold text-[#1a4a28] uppercase">{plant.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-semibold text-[#153b20]">LKR {plant.price.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};
