"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sun, Droplets, ThermometerSun, ShoppingCart } from "lucide-react";
import { Plant } from "../lib/data";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export const PlantModal = ({ plant, onClose }: { plant: Plant; onClose: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const images = plant.images && plant.images.length > 0 ? plant.images : (plant.image ? [plant.image] : []);

  const handleNext = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left: Image Gallery */}
          <div className="w-full md:w-1/2 relative bg-gray-100 min-h-[40vh] md:min-h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={images[currentImage]}
                alt={plant.name}
                className="w-full h-full absolute inset-0 object-cover"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg text-[#1a4a28] hover:bg-white transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg text-[#1a4a28] hover:bg-white transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all shadow-md ${
                        currentImage === idx ? "bg-white scale-125" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
            <h2 className="font-playfair text-4xl font-bold text-[#1a4a28] mb-2 uppercase">{plant.name}</h2>
            <p className="text-gray-400 italic text-lg mb-6">{plant.scientificName}</p>
            
            <p className="text-3xl font-bold text-[#3b8554] mb-8">
              LKR {plant.price.toLocaleString()}
            </p>

            <div className="mb-8">
              <h3 className="font-semibold text-[#1a4a28] mb-3 text-lg">{t("description")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {plant.description || "A beautiful, carefully nurtured Anthurium ready to bring life and fresh air to your outdoor space."}
              </p>
            </div>

            <div className="space-y-4 mb-10 bg-[#f4f7f4]/50 p-6 rounded-2xl border border-[#3b8554]/10">
              <h3 className="font-semibold text-[#1a4a28] mb-4">{t("careInstructions")}</h3>
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sun className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">{t("sunlight")}</p>
                  <p className="font-medium">{plant.care.sunlight}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">{t("watering")}</p>
                  <p className="font-medium">{plant.care.watering}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ThermometerSun className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">{t("environment")}</p>
                  <p className="font-medium">{plant.care.environment}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  addToCart(plant);
                  onClose();
                }}
                className="w-full bg-[#1a4a28] text-white py-4 rounded-xl font-bold hover:bg-[#3b8554] transition-colors flex justify-center items-center gap-3 text-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                {t("addToCart")}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
