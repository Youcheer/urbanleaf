"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "si";

type TranslationsType = typeof translations.en;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationsType) => string;
}

const translations = {
  en: {
    home: "Home",
    collection: "Collection",
    aboutUs: "About Us",
    heroHeadline: "Tropical Beauty &\nTimeless Elegance for Your Space",
    heroSubheadline: "A premium collection of vibrant Anthuriums from Urban Leaf. Transform your home or office into a lively, luxurious sanctuary.",
    heroCta: "Shop Now",
    ourCollection: "Our Collection",
    organic: "100% Organic",
    premiumQuality: "Premium Quality",
    addToCart: "Add to Cart",
    cartTitle: "Shopping Cart",
    cartEmpty: "Your cart is empty",
    total: "Total",
    checkoutWhatsApp: "Checkout via WhatsApp",
    sunlight: "Sunlight",
    watering: "Watering",
    environment: "Environment",
    careInstructions: "Care Instructions",
    backToStore: "Back to Store",
    adminDashboard: "Admin Dashboard",
    price: "Price",
    description: "Description",
    yourName: "Your Name",
    deliveryAddress: "Delivery Address",
    pleaseEnterDetails: "Please enter your name and address.",
    aboutThisPlant: "About this plant",
    footerSubheadline: "Bringing the beauty of nature into your spaces with our premium, carefully curated Anthurium collection in Sri Lanka.",
  },
  si: {
    home: "මුල් පිටුව",
    collection: "අපගේ එකතුව",
    aboutUs: "අපි ගැන",
    heroHeadline: "ඔබේ අවකාශයට නිවර්තන සුන්දරත්වයක් සහ සදාකාලික අලංකාරයක්",
    heroSubheadline: "Urban Leaf වෙතින් උසස්ම තත්ත්වයේ, වර්ණවත් ඇන්තුරියම් (Anthurium) එකතුවක්. ඔබේ නිවස හෝ කාර්යාලය සජීවී, සුඛෝපභෝගී තැනක් බවට පත්කරන්න.",
    heroCta: "දැන්ම මිලදී ගන්න",
    ourCollection: "අපගේ එකතුව",
    organic: "100% කාබනික",
    premiumQuality: "ඉහළම තත්ත්වය",
    addToCart: "කරත්තයට එක් කරන්න",
    cartTitle: "මිලදී ගැනීමේ කරත්තය",
    cartEmpty: "ඔබගේ කරත්තය හිස් ය",
    total: "මුළු එකතුව",
    checkoutWhatsApp: "WhatsApp හරහා ඇණවුම් කරන්න",
    sunlight: "සූර්යාලෝකය",
    watering: "ජලය සැපයීම",
    environment: "පරිසරය",
    careInstructions: "රැකබලා ගැනීමේ උපදෙස්",
    backToStore: "වෙළඳසැලට ආපසු",
    adminDashboard: "පරිපාලන පැනලය",
    price: "මිල",
    description: "විස්තරය",
    yourName: "ඔබගේ නම",
    deliveryAddress: "බෙදා හැරීමේ ලිපිනය",
    pleaseEnterDetails: "කරුණාකර ඔබගේ නම සහ ලිපිනය ඇතුළත් කරන්න.",
    aboutThisPlant: "පැලය පිළිබඳ විස්තරය",
    footerSubheadline: "ශ්‍රී ලංකාවේ උසස්ම තත්ත්වයේ, ප්‍රවේශමෙන් තෝරාගත් ඇන්තුරියම් (Anthurium) එකතුවක් සමඟින් සොබාදහමේ සුන්දරත්වය ඔබේ අවකාශයට එක් කිරීම.",
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("si"); // Default to Sinhala as requested

  useEffect(() => {
    const savedLang = localStorage.getItem("urbanleaf_lang") as Language;
    if (savedLang === "en" || savedLang === "si") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("urbanleaf_lang", lang);
  };

  const t = (key: keyof TranslationsType): string => {
    return translations[language][key] || translations["si"][key] || "";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
