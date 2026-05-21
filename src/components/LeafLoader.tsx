"use client";

import React from "react";
import { motion } from "framer-motion";

export const LeafLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ 
          scale: [0.8, 1.1, 0.8], 
          opacity: [0.5, 1, 0.5],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.06 19.43 4 16.05 4 12C4 7.95 7.06 4.57 11 4.07V19.93ZM13 4.07C16.94 4.57 20 7.95 20 12C20 16.05 16.94 19.43 13 19.93V4.07Z"
          fill="var(--color-primary)"
        />
        {/* Leaf details stylized for anthurium */}
        <path d="M12 3C8 3 4 7 4 12C4 17 12 21 12 21C12 21 20 17 20 12C20 7 16 3 12 3ZM12 19.2C9.5 16.5 6 13.5 6 12C6 8.5 8.5 6 12 6C15.5 6 18 8.5 18 12C18 13.5 14.5 16.5 12 19.2Z" fill="var(--color-accent)"/>
        <path d="M12 6V21" stroke="var(--color-primary)" strokeWidth="0.5" strokeLinecap="round"/>
      </motion.svg>
      <motion.p 
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="font-serif text-primary/80 dark:text-on-surface/80 tracking-widest text-sm uppercase font-bold"
      >
        Blooming...
      </motion.p>
    </div>
  );
};
