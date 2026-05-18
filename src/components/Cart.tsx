"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export const Cart = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleCheckout = () => {
    if (!name || !address) {
      alert(t("pleaseEnterDetails"));
      return;
    }

    const orderDetails = cart
      .map((item) => `${item.name} (x${item.quantity}) - LKR ${(item.price * item.quantity).toLocaleString()}`)
      .join("%0A");

    const message = `Hello Urban Leaf! I would like to place an order:%0A%0A*Order Details:*%0A${orderDetails}%0A%0A*Total:* LKR ${cartTotal.toLocaleString()}%0A%0A*Customer Details:*%0AName: ${name}%0AAddress: ${address}`;
    
    // Configured Seller WhatsApp number
    const whatsappUrl = `https://wa.me/94718546219?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-[4px] z-50"
          />
          
          {/* Cart Sidebar Panel in exact Premium Dark Forest Green from Screenshot */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#002115] shadow-2xl z-50 flex flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#86b98d] flex items-center gap-3">
                <span className="material-symbols-outlined font-light text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                  shopping_bag
                </span>
                {t("cartTitle")}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#86b98d] hover:text-white transition-colors rounded-full hover:bg-white/5 active:scale-90 cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined block text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                  close
                </span>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#86b98d]/40 gap-4">
                  <span className="material-symbols-outlined text-6xl font-light opacity-30" style={{ fontVariationSettings: "'FILL' 0" }}>
                    shopping_bag
                  </span>
                  <p className="font-sans font-light tracking-wide text-sm">{t("cartEmpty")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const itemImg = item.images && item.images.length > 0 ? item.images[0] : item.image;
                    return (
                      <motion.div
                        layout
                        key={item.id}
                        className="flex gap-4 p-4 rounded-3xl bg-[#c8d4c5] border border-[#c8d4c5] shadow-lg relative"
                      >
                        <img src={itemImg} alt={item.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 flex flex-col justify-between pr-4">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-serif text-[15px] text-[#003314] font-bold leading-tight uppercase tracking-wide">{item.name}</h3>
                            </div>
                            <p className="text-[#003314] font-serif font-bold text-xs mt-1.5">LKR {item.price.toLocaleString()}</p>
                          </div>
                          
                          {/* Quantity selectors from Screenshot */}
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-[#003314] text-white rounded-full hover:opacity-90 transition-all active:scale-90 border-none cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs font-bold" style={{ fontVariationSettings: "'FILL' 0" }}>
                                remove
                              </span>
                            </button>
                            <span className="font-sans font-bold text-xs text-[#003314]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-[#003314] text-white rounded-full hover:opacity-90 transition-all active:scale-90 border-none cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs font-bold" style={{ fontVariationSettings: "'FILL' 0" }}>
                                add
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Top-Right Remove/Close Button from Screenshot */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="absolute top-4 right-4 text-[#003314] hover:text-[#ba1a1a] p-0.5 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                        >
                          <span className="material-symbols-outlined block text-base font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                            close
                          </span>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Checkout Panel */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#072110]/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#86b98d]/60 font-sans text-sm font-medium">{t("total")}</span>
                  <span className="text-xl font-serif font-bold text-[#baefc0]">LKR {cartTotal.toLocaleString()}</span>
                </div>
                
                {/* Clean white inputs from Screenshot */}
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder={t("yourName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#86b98d] bg-white text-[#003314] font-sans text-sm placeholder:text-gray-400 transition-all duration-300 font-light"
                  />
                  <textarea
                    placeholder={t("deliveryAddress")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#86b98d] bg-white text-[#003314] font-sans text-sm placeholder:text-gray-400 transition-all duration-300 resize-none font-light"
                  />
                </div>

                {/* CHECKOUT VIA WHATSAPP Button from Screenshot */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#00170f] hover:bg-[#002d1a] border border-white/15 text-white py-4 rounded-default font-sans font-bold hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2.5 uppercase tracking-[0.08em] text-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                    chat
                  </span>
                  {t("checkoutWhatsApp")}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
