"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#f4f7f4]">
      {/* Background Floating Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-20 -left-10 w-64 h-64 bg-[#3b8554]/10 rounded-full blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 -right-10 w-96 h-96 bg-[#1a4a28]/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ opacity }}
        >
          <h1 className="font-playfair text-5xl md:text-7xl font-bold leading-tight text-[#1a4a28] mb-6">
            Bring Nature <br />
            <span className="text-[#3b8554] italic">Home</span>
          </h1>
          <p className="text-lg md:text-xl text-[#1a4a28]/80 mb-8 max-w-lg leading-relaxed">
            Discover our curated collection of premium indoor plants. Transform your living space into a lush, breathable sanctuary.
          </p>
          <a
            href="#collection"
            className="inline-flex items-center gap-2 bg-[#1a4a28] text-white px-8 py-4 rounded-full font-medium hover:bg-[#3b8554] transition-all transform hover:scale-105"
          >
            Shop Collection
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-[50vh] lg:h-[70vh] w-full"
        >
          {/* Main Hero Image */}
          <motion.img
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            src="https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&q=80&w=1200"
            alt="Beautiful Monstera Plant"
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
          
          {/* Floating Element 1 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-[#f4f7f4] rounded-full flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <p className="font-bold text-[#1a4a28]">100% Organic</p>
              <p className="text-sm text-gray-500">Premium Quality</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
