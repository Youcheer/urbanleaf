"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export const Cart = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleCheckout = () => {
    if (!name || !address) {
      alert("Please enter your name and address.");
      return;
    }

    const orderDetails = cart
      .map((item) => `${item.name} (x${item.quantity}) - LKR ${item.price * item.quantity}`)
      .join("%0A");

    const message = `Hello Urban Leaf! I would like to place an order:%0A%0A*Order Details:*%0A${orderDetails}%0A%0A*Total:* LKR ${cartTotal}%0A%0A*Customer Details:*%0AName: ${name}%0AAddress: ${address}`;
    
    const whatsappUrl = `https://wa.me/94700000000?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b flex items-center justify-between bg-[#f4f7f4]">
              <h2 className="font-playfair text-2xl font-bold text-[#1a4a28] flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <motion.div layout key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-2xl">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-[#1a4a28]">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[#3b8554] font-semibold mt-1">LKR {item.price}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 text-[#1a4a28]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-medium text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 text-[#1a4a28]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-[#1a4a28]">LKR {cartTotal.toLocaleString()}</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554] bg-white"
                  />
                  <textarea
                    placeholder="Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554] bg-white resize-none"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#1a4a28] text-white py-4 rounded-xl font-bold hover:bg-[#3b8554] transition-colors flex justify-center items-center gap-2"
                >
                  Order via WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
