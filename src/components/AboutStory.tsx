"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export const AboutStory = () => {
  const { language } = useLanguage();

  const getContent = () => {
    if (language === "si") {
      return {
        headline: "සන්සුන් බව වගා කිරීම.",
        para1: "Urban Leaf බිහිවූයේ උසස් අභ්‍යන්තර සැලසුම්කරණය සහ සොබාදහමේ සුවදායී ශක්තිය අතර පරතරය පියවීමේ අරමුණ ඇතිවය. ඔබේ නිවහන තුළ සෑම ශාකයක්ම සජීවී මූර්තියක් ලෙස බැබළෙන සේ, ව්‍යුහාත්මකව අලංකාරවත් සහ ශක්තිමත් ශාක පත්‍ර පමණක්ම අපි සපයන්නෙමු.",
        para2: "අපගේ තෝරාගත් පැලෑටි එකතුව, ඒවායේ කල්පැවැත්ම, සෞන්දර්යාත්මක ආකර්ෂණය සහ නවීන නාගරික පරිසරයට සැබෑ සුඛෝපභෝගී හැඟීමක් එක් කිරීම කෙරෙහි සුවිශේෂී අවධානයක් යොමු කරයි.",
        cta: "අපගේ කතාව",
      };
    }
    return {
      headline: "Cultivating Serenity.",
      para1: "Urban Leaf was born from a desire to bridge the gap between high-end interior design and the restorative power of nature. We source only the most structurally striking and robust botanical specimens, ensuring each plant acts as a living sculpture within your space.",
      para2: "Our curated selection focuses on longevity, aesthetic impact, and bringing a sense of grounded luxury to modern urban environments.",
      cta: "Read Our Story",
    };
  };

  const content = getContent();

  return (
    <section id="about" className="py-section-gap bg-surface-container-lowest relative overflow-hidden">
      {/* Background Decorative Radial Gradient */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_var(--color-surface-tint)_0%,_transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left column: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 space-y-8"
        >
          <h2 className="text-headline-lg font-serif text-primary">
            {content.headline}
          </h2>
          <div className="w-12 h-[1px] bg-primary" />
          
          <p className="text-body-lg font-sans text-on-surface-variant leading-relaxed font-light">
            {content.para1}
          </p>
          
          <p className="text-body-md font-sans text-outline leading-relaxed font-light">
            {content.para2}
          </p>
          
          <button className="px-6 py-3 border border-primary text-primary rounded-default hover:bg-primary hover:text-white active:scale-95 transition-all duration-300 text-label-md font-sans uppercase tracking-widest mt-4">
            {content.cta}
          </button>
        </motion.div>

        {/* Right column: Image container */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="w-full md:w-1/2 relative"
        >
          <div className="aspect-[4/5] rounded-xl overflow-hidden glass-panel relative z-10">
            <img
              alt="Luxury Botanical Interior Design"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeFnqL6dS93vhEMuRFC6IycOiGPAEZvD6594nmxAiSQv2LktgtT2bWYW9rzBkGXK4RaPwYZZa20wCIfh6XvoyA3X04TjE7PfRjUHHDUqqcG1KHxnpwpLpc3WQR2eTzpEg0pgJ9HdfMpd6o489WaKwm1d_vrVKfYQrTfSmRvfiKjvVKv1lgVVJO-7ca8Y9Dx78qj4blFHWxRUlV0uEFbeqXnM-n3bDv__KkNq6DfsJhK7kdIJhmrGcpjfT6CpUkkaVhqMLwXGMB-FJJ"
            />
          </div>
          
          {/* Ambient blurred backdrop shadow to ground the image */}
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-surface-container rounded-full blur-3xl opacity-60 z-0 pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
};
