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
  const [contactNumber, setContactNumber] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const handleCheckout = () => {
    if (!name || !address || !contactNumber) {
      alert(t("pleaseEnterDetails"));
      return;
    }

    const orderDetails = cart
      .map((item) => `${item.name} (x${item.quantity}) - LKR ${(item.price * item.quantity).toLocaleString()}`)
      .join("%0A");

    const noteText = orderNote ? `%0AOrder Note: ${orderNote}` : "";
    const message = `Hello Urban Leaf! I would like to place an order:%0A%0A*Order Details:*%0A${orderDetails}%0A%0A*Total:* LKR ${cartTotal.toLocaleString()}%0A%0A*Customer Details:*%0AName: ${name}%0AContact Number: ${contactNumber}%0AAddress: ${address}${noteText}`;
    
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
            className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-50"
          />
          
          {/* Cart Sidebar Panel in Premium Light Sage Wash with #002115 Text */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#f7faf7] dark:bg-surface shadow-2xl z-50 flex flex-col border-l border-[#002115]/10 dark:border-white/10 text-[#002115] dark:text-on-surface"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#002115]/10 dark:border-white/10 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#002115] dark:text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined font-light text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                  shopping_bag
                </span>
                {t("cartTitle")}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#002115]/75 dark:text-white/75 hover:text-[#ba1a1a] transition-colors rounded-full hover:bg-[#002115]/5 dark:hover:bg-white/10 active:scale-90 cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined block text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                  close
                </span>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#002115]/45 dark:text-white/45 gap-4">
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
                        className="flex gap-4 p-4 rounded-3xl bg-[#c8d4c5] dark:bg-surface-container border border-[#c8d4c5] dark:border-white/10 shadow-lg relative"
                      >
                        <img src={itemImg} alt={item.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 flex flex-col justify-between pr-4">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-serif text-[15px] text-[#003314] dark:text-on-surface font-bold leading-tight uppercase tracking-wide">{item.name}</h3>
                            </div>
                            <p className="text-[#003314] dark:text-on-surface font-serif font-bold text-xs mt-1.5">LKR {item.price.toLocaleString()}</p>
                          </div>
                          
                          {/* Quantity selectors from Screenshot */}
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-[#003314] dark:bg-primary-container text-white dark:text-on-primary-container rounded-full hover:opacity-90 transition-all active:scale-90 border-none cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs font-bold" style={{ fontVariationSettings: "'FILL' 0" }}>
                                remove
                              </span>
                            </button>
                            <span className="font-sans font-bold text-xs text-[#003314] dark:text-on-surface">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-[#003314] dark:bg-primary-container text-white dark:text-on-primary-container rounded-full hover:opacity-90 transition-all active:scale-90 border-none cursor-pointer"
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
                          className="absolute top-4 right-4 text-[#003314] dark:text-white/70 hover:text-[#ba1a1a] dark:hover:text-[#ba1a1a] p-0.5 rounded-full transition-colors cursor-pointer border-none bg-transparent"
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
              <div className="p-6 border-t border-[#002115]/10 dark:border-white/10 bg-[#ecefec] dark:bg-surface-container-low">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#002115]/60 dark:text-on-surface/60 font-sans text-sm font-medium">{t("total")}</span>
                  <span className="text-xl font-serif font-bold text-[#002115] dark:text-on-surface">LKR {cartTotal.toLocaleString()}</span>
                </div>
                
                {/* Clean white inputs with dark green borders */}
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder={t("yourName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#002115]/20 dark:border-white/20 focus:outline-none focus:ring-1 focus:ring-[#002115]/30 dark:focus:ring-white/30 bg-white dark:bg-surface-container-lowest text-[#003314] dark:text-on-surface font-sans text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 font-light"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#002115]/20 dark:border-white/20 focus:outline-none focus:ring-1 focus:ring-[#002115]/30 dark:focus:ring-white/30 bg-white dark:bg-surface-container-lowest text-[#003314] dark:text-on-surface font-sans text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 font-light"
                  />
                  <textarea
                    placeholder={t("deliveryAddress")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[#002115]/20 dark:border-white/20 focus:outline-none focus:ring-1 focus:ring-[#002115]/30 dark:focus:ring-white/30 bg-white dark:bg-surface-container-lowest text-[#003314] dark:text-on-surface font-sans text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 resize-none font-light"
                  />
                  <textarea
                    placeholder="Order Note (Optional)"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[#002115]/20 dark:border-white/20 focus:outline-none focus:ring-1 focus:ring-[#002115]/30 dark:focus:ring-white/30 bg-white dark:bg-surface-container-lowest text-[#003314] dark:text-on-surface font-sans text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 resize-none font-light"
                  />
                </div>

                {/* CHECKOUT VIA WHATSAPP Button (Solid Dark Contrast CTA) */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#002115] hover:bg-[#003823] dark:bg-primary dark:text-on-primary dark:hover:opacity-90 text-white py-4 rounded-default font-sans font-bold hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2.5 uppercase tracking-[0.08em] text-[12px] shadow-[0_8px_32px_rgba(0,33,20,0.12)] cursor-pointer border-none"
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
