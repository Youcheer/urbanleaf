"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getPlants } from "../../lib/db";
import { Plant } from "../../lib/data";
import { motion } from "framer-motion";

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
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-playfair text-display-md md:text-display-lg text-primary dark:text-on-surface mb-4">
            Media Gallery
          </h1>
          <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl">
            A high-quality visual collection showcasing our premium plants in various stages.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 font-sans">No images available yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 10) * 0.1 }}
                className="relative break-inside-avoid overflow-hidden rounded-[var(--radius-leaf)] group cursor-pointer"
                onClick={() => setSelectedImage(img.url)}
              >
                <img
                  src={img.url}
                  alt={img.plantName}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-sans text-sm font-semibold truncate drop-shadow-md">
                    {img.plantName}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
