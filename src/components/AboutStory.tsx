"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export const AboutStory = () => {
  const { language } = useLanguage();

  const getContent = () => {
    if (language === "si") {
      return {
        headline: "Urban Leaf ශ්‍රී ලංකා සමඟින් සොබාදහමේ සන්සුන් බව වගා කිරීම",
        storyTitle: "අපගේ කතාව (Our Story)",
        storyPara: '"Urban Leaf" අපගේ පාරිභෝගිකයින් වෙත උසස් තත්ත්වයේ සහ සෞඛ්‍ය සම්පන්න පැලෑටි සැපයීම සඳහා කැපවී සිටී. ශ්‍රී ලංකාවේ ගණේමුල්ල පදනම් කරගත් අපි, සොබාදහමේ සුවදායී ශක්තිය ඔබේ නිවසට ළඟා කිරීමට උද්‍යෝගයෙන් කටයුතු කරන විශ්වාසදායක පැල තවානක් සහ ගෙවතු වගා වෙළඳසැලකි.',
        collectionTitle: "අපගේ එකතුව (Our Collection)",
        collectionPara: "අපි විවිධාකාර සහ නිරන්තරයෙන් වර්ධනය වන, සජීවී මෙන්ම හොඳින් රැකබලා ගත් ගෘහස්ථ පැලෑටි එකතුවක් සැපයීම සඳහා විශේෂීකරණය වී සිටිමු. විශිෂ්ටතම ඇන්තුරියම් (Anthuriums) වර්ග සහ අනෙකුත් සශ්‍රීක උද්භිද පැලෑටි කෙරෙහි දැඩි අවධානයක් යොමු කරමින්, ඕනෑම සෞන්දර්යාත්මක රුචිකත්වයකට ගැළපෙන පරිදි පුළුල් පරාසයක තේරීම් අපි පිරිනමන්නෙමු. ඔබ අලංකාර මල් සහිත පැල හෝ ආකර්ශනීය පත්‍ර සහිත පැල සෙවුවද, අපගේ ප්‍රවේශමෙන් තෝරාගත් පැලෑටි ඔබේ නවීන නාගරික අවකාශය අලංකාර කරන සජීවී මූර්තීන් ලෙස ක්‍රියා කරයි.",
        whyTitle: "ඇයි අපව තෝරාගත යුත්තේ? (Why Choose Us)",
        benefits: [
          {
            title: "ඉහළම තත්ත්වය (Premium Quality)",
            desc: "අපි වඩාත් ශක්තිමත්, සෞඛ්‍ය සම්පන්න සහ සෞන්දර්යාත්මකව ආකර්ශනීය පැලෑටි පමණක්ම සපයන්නෙමු."
          },
          {
            title: "සාධාරණ මිල ගණන් (Reasonable Prices)",
            desc: "ඉතා උසස් තත්ත්වයේ පැලෑටි සාධාරණ සහ දැරිය හැකි මිල ගණන් යටතේ ලබාගත හැක."
          },
          {
            title: "ආරක්ෂිත ප්‍රවාහනය (Convenient Delivery)",
            desc: "ඔබගේ නිවසටම පැලෑටි ආරක්ෂිතව ගෙනවිත් දීම සඳහා අපි විශ්වාසදායක කුරියර් පහසුකම් සපයන්නෙමු."
          },
          {
            title: "පැමිණ ලබා ගැනීම (Local Pickup)",
            desc: "ගම්පහ සහ කඩවත ප්‍රදේශ අවට සෘජුවම පැමිණ ලබා ගැනීමේ (pickup) පහසුකම් ද සපයා ඇත."
          }
        ],
        cta: "අපගේ එකතුව මිලදී ගන්න"
      };
    }
    return {
      headline: "Cultivating Serenity with Urban Leaf Sri Lanka",
      storyTitle: "Our Story",
      storyPara: '"Urban Leaf" is dedicated to providing high-quality, healthy plants to our customers. Based in Ganemulla, Sri Lanka, we are a trusted nursery and gardening store passionate about bringing the restorative power of nature into your home.',
      collectionTitle: "Our Collection",
      collectionPara: "We specialize in a diverse and ever-growing collection of vibrant, well-nurtured indoor plants. With a strong focus on a wide variety of premium Anthuriums and other lush botanicals, we offer an extensive range of choices to suit any aesthetic. Whether you are looking for plants with beautiful blooms or striking foliage, our carefully curated botanical specimens act as living sculptures to elevate your modern urban space.",
      whyTitle: "Why Choose Us?",
      benefits: [
        {
          title: "Premium Quality",
          desc: "We source and nurture only the most robust, healthy, and aesthetically striking plants."
        },
        {
          title: "Reasonable Prices",
          desc: "High-end greenery at fair and affordable rates."
        },
        {
          title: "Convenient Delivery",
          desc: "We offer safe courier facilities to deliver plants right to your doorstep."
        },
        {
          title: "Local Pickup",
          desc: "Direct pickup options are also available around the Gampaha and Kadawatha areas."
        }
      ],
      cta: "Shop Our Collection"
    };
  };

  const content = getContent();

  const handleCtaClick = () => {
    const el = document.getElementById("collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-24 bg-[#f7faf7] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#1f6c3d_0%,_transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Column: Premium Gardener Illustration Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 relative shrink-0"
        >
          <div className="aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl border border-white/40 bg-white/20 backdrop-blur-md relative z-10 group">
            <img
              src="/about_gardener.jpg"
              alt="Urban Leaf Sri Lanka - Nursery & Gardening Store"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
          </div>
          
          {/* Decorative ambient lighting behind image */}
          <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-[#1f6c3d]/10 rounded-full blur-3xl opacity-60 z-0 pointer-events-none" />
        </motion.div>

        {/* Right Column: Editorial Text Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
          }}
          className="w-full lg:w-1/2 flex flex-col text-[#002115]"
        >
          {/* Main Headline */}
          <motion.h2 variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }} className="font-serif text-3xl md:text-[36px] lg:text-[40px] font-bold leading-tight mb-6 uppercase tracking-wide">
            {content.headline}
          </motion.h2>
          
          {/* Thin horizontal divider */}
          <motion.div variants={{
            hidden: { opacity: 0, width: 0 },
            visible: { opacity: 1, width: 64, transition: { duration: 0.8, ease: "easeOut" } }
          }} className="border-t border-[#002115]/10 mb-8" />

          {/* Section: Our Story */}
          <motion.div variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }} className="mb-6">
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider mb-2 text-[#002115]">
              {content.storyTitle}
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[#002115]/80 font-light">
              {content.storyPara}
            </p>
          </motion.div>

          {/* Section: Our Collection */}
          <motion.div variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }} className="mb-8">
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider mb-2 text-[#002115]">
              {content.collectionTitle}
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[#002115]/80 font-light">
              {content.collectionPara}
            </p>
          </motion.div>

          {/* Section: Why Choose Us Benefits list */}
          <motion.div variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }} className="mb-8 py-6 border-t border-b border-[#002115]/10">
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider mb-4 text-[#002115]">
              {content.whyTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1f6c3d]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-xs text-[#002115] font-bold">
                      check
                    </span>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-[#002115]">
                      {benefit.title}
                    </h4>
                    <p className="font-sans text-xs leading-relaxed text-[#002115]/70 mt-1 font-light">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}>
            <button
              onClick={handleCtaClick}
              className="bg-[#002115] hover:bg-[#003823] text-white px-8 py-4 rounded-full font-sans font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.1em] shadow-[0_8px_32px_rgba(0,33,20,0.12)] cursor-pointer border-none"
            >
              {content.cta}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </button>
          </motion.div>
          
        </motion.div>

      </div>
    </section>
  );
};
