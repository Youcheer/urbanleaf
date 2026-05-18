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
      .map((item) => `${item.name} (x${item.quantity}) - LKR ${item.price * item.quantity}`)
      .join("%0A");

    const message = `Hello Urban Leaf! I would like to place an order:%0A%0A*Order Details:*%0A${orderDetails}%0A%0A*Total:* LKR ${cartTotal.toLocaleString()}%0A%0A*Customer Details:*%0AName: ${name}%0AAddress: ${address}`;
    
    // Replace with the seller's WhatsApp number
    const whatsappUrl = `https://wa.me/94700000000?text=${message}`;
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
            className="fixed inset-0 bg-black/45 backdrop-blur-[4px] z-50"
          />
          
          {/* Cart Sidebar Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background dark:bg-tertiary shadow-2xl z-50 flex flex-col border-l border-outline-variant/20"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low dark:bg-tertiary-container/30">
              <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-3">
                <span className="material-symbols-outlined font-light text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                  shopping_bag
                </span>
                {t("cartTitle")}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-primary hover:text-error transition-colors rounded-full hover:bg-surface-container active:scale-90"
              >
                <span className="material-symbols-outlined block text-xl font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                  close
                </span>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50 gap-4">
                  <span className="material-symbols-outlined text-6xl font-light opacity-30" style={{ fontVariationSettings: "'FILL' 0" }}>
                    shopping_bag
                  </span>
                  <p className="font-sans font-light tracking-wide text-sm">{t("cartEmpty")}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => {
                    const itemImg = item.images && item.images.length > 0 ? item.images[0] : item.image;
                    return (
                      <motion.div
                        layout
                        key={item.id}
                        className="flex gap-4 p-4 rounded-xl glass-panel bg-white/40 dark:bg-tertiary/40 border border-outline-variant/15 shadow-[0_4px_16px_rgba(0,38,26,0.02)]"
                      >
                        <img src={itemImg} alt={item.name} className="w-20 h-20 object-cover rounded-default" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-serif text-sm text-primary font-semibold leading-tight">{item.name}</h3>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-on-surface-variant hover:text-error p-0.5 rounded-full hover:bg-surface-container transition-all duration-300"
                              >
                                <span className="material-symbols-outlined block text-base font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                                  close
                                </span>
                              </button>
                            </div>
                            <p className="text-surface-tint font-sans font-semibold text-xs mt-1">LKR {item.price.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white/80 dark:bg-tertiary/80 rounded-full shadow-sm hover:bg-primary hover:text-white border border-outline-variant/20 transition-all active:scale-90 text-primary"
                            >
                              <span className="material-symbols-outlined text-xs font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                                remove
                              </span>
                            </button>
                            <span className="font-sans font-semibold text-xs text-primary">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white/80 dark:bg-tertiary/80 rounded-full shadow-sm hover:bg-primary hover:text-white border border-outline-variant/20 transition-all active:scale-90 text-primary"
                            >
                              <span className="material-symbols-outlined text-xs font-light" style={{ fontVariationSettings: "'FILL' 0" }}>
                                add
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Checkout Panel */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low dark:bg-tertiary-container/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-on-surface-variant font-sans text-sm font-medium">{t("total")}</span>
                  <span className="text-xl font-sans font-bold text-primary">LKR {cartTotal.toLocaleString()}</span>
                </div>
                
                {/* Minimalist checkout form with subtle glows */}
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder={t("yourName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-default border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-sans text-sm transition-all duration-300 font-light"
                  />
                  <textarea
                    placeholder={t("deliveryAddress")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-default border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-sans text-sm transition-all duration-300 resize-none font-light"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-on-primary py-4 rounded-default font-sans font-semibold hover:bg-surface-tint active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 uppercase tracking-widest text-sm shadow-[0_8px_32px_rgba(0,38,26,0.1)]"
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
