"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getPlants } from "../../lib/db";
import { Plant } from "../../lib/data";
import { motion } from "framer-motion";
import { LeafLoader } from "../../components/LeafLoader";

export default function GalleryPage() {
  const [images, setImages] = useState<{ url: string; plantName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getPlants();
        const allImages: { url: string; plantName: string }[] = [];
        data.forEach((plant) => {
          if (plant.images && plant.images.length > 0) {
            plant.images.forEach((img) => {
              allImages.push({ url: img, plantName: plant.name });
            });
          } else if (plant.image) {
            allImages.push({ url: plant.image, plantName: plant.name });
          }
        });
        setImages(allImages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <main className="min-h-screen bg-surface-container-lowest pb-24">
      <Navbar />

      <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center md:text-left relative"
        >
          {/* Decorative blur blob */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          <h1 className="font-playfair text-display-md md:text-display-lg text-primary dark:text-on-surface mb-4">
            Our <span className="italic font-light">Living</span> Canvas
          </h1>
          <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl">
            A curated visual journey through our premium botanical collection. 
            Discover the vibrant textures, colors, and life stages of our beautiful plants.
          </p>
        </motion.div>

        {loading ? (
          <LeafLoader />
        ) : images.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 font-sans">No images available yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {images.map((img, idx) => {
              // Alternate border radius for a more dynamic "Bento/Scattered" look
              const isEven = idx % 2 === 0;
              const isDivisibleBy3 = idx % 3 === 0;
              const radiusClass = isEven 
                ? "rounded-[var(--radius-leaf)]" // Leaf shape
                : isDivisibleBy3 ? "rounded-full" : "rounded-3xl"; // Mix of pills/circles and standard rounded

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.7, 
                    delay: (idx % 8) * 0.1, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative break-inside-avoid overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-surface ${radiusClass}`}
                  onClick={() => setSelectedImage(img.url)}
                  // Add slightly varying aspect ratios to force a true masonry look even if source images are square
                  style={{ minHeight: isEven ? '300px' : '250px' }}
                >
                  <img
                    src={img.url}
                    alt={img.plantName}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="inline-block px-3 py-1 mb-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-white/90 backdrop-blur-md rounded-full">
                        View
                      </span>
                      <h3 className="text-white font-playfair text-xl md:text-2xl font-medium drop-shadow-md leading-tight">
                        {img.plantName}
                      </h3>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-6 right-6 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300 bg-white/10 hover:bg-white/20 p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <span className="material-symbols-outlined text-3xl block">close</span>
          </motion.button>
          
          <motion.img 
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            src={selectedImage}
            alt="Expanded view"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </main>
  );
}
