"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Leaf } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export const Navbar = () => {
  const { cart, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <Leaf className="w-8 h-8 text-[#3b8554]" />
          <span className="font-playfair font-bold text-2xl text-[#1a4a28]">
            Urban Leaf
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-[#1a4a28]">
          <a href="#home" className="hover:text-[#3b8554] transition-colors">Home</a>
          <a href="#collection" className="hover:text-[#3b8554] transition-colors">Collection</a>
          <a href="#about" className="hover:text-[#3b8554] transition-colors">About Us</a>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 text-[#1a4a28] hover:text-[#3b8554] transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-[#3b8554] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </motion.nav>
  );
};
