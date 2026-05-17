"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Save, Sparkles, Upload } from "lucide-react";
import { getPlants, addPlant, updatePlant, deletePlant } from "../../lib/db";
import { Plant } from "../../lib/data";
import Link from "next/link";

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1599421487840-02c34fc07df0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1597055905091-88981f337f7a?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1598880940080-c97a5f6e80b2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=800"
];

// Client-side image compressor using HTML5 Canvas
const compressImage = (file: File, maxWidth = 800, quality = 0.75): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context is null"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas toBlob failed"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [plantsList, setPlantsList] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0]);
  const [categories, setCategories] = useState<string[]>(["Indoor Spaces"]);
  const [sunlight, setSunlight] = useState("");
  const [watering, setWatering] = useState("");
  const [environment, setEnvironment] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  useEffect(() => {
    // Check if previously authenticated in this session
    const authStatus = sessionStorage.getItem("urbanleaf_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlants();
    }
  }, [isAuthenticated]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const data = await getPlants();
      setPlantsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("urbanleaf_admin_auth", "true");
    } else {
      alert("Incorrect Password!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("urbanleaf_admin_auth");
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setName(plant.name);
    setScientificName(plant.scientificName);
    setPrice(plant.price.toString());
    setImageUrl(plant.image);
    setCategories(plant.category);
    setSunlight(plant.care.sunlight);
    setWatering(plant.care.watering);
    setEnvironment(plant.care.environment);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plant?")) {
      try {
        await deletePlant(id);
        fetchPlants();
      } catch (err) {
        alert("Failed to delete plant");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Compress the image client-side first (Max width 800px, 75% JPEG quality)
      const compressedBlob = await compressImage(file, 800, 0.75);
      
      const formData = new FormData();
      // ImgBB requires a file name, so convert Blob to File
      const compressedFile = new File([compressedBlob], file.name, {
        type: "image/jpeg",
        lastModified: Date.now()
      });
      formData.append("image", compressedFile);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "1421a9d660059426977d35dad31197d0";

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      if (result.success && result.data?.url) {
        setImageUrl(result.data.url);
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) {
      alert("Please fill in required fields.");
      return;
    }

    const plantData = {
      name,
      scientificName,
      price: parseFloat(price),
      image: imageUrl,
      category: categories,
      care: {
        sunlight,
        watering,
        environment,
      },
    };

    try {
      if (editingPlant) {
        await updatePlant(editingPlant.id, plantData);
      } else {
        await addPlant(plantData);
      }
      resetForm();
      fetchPlants();
    } catch (err) {
      alert("Failed to save plant.");
    }
  };

  const resetForm = () => {
    setEditingPlant(null);
    setName("");
    setScientificName("");
    setPrice("");
    setImageUrl(PRESET_IMAGES[0]);
    setCategories(["Indoor Spaces"]);
    setSunlight("");
    setWatering("");
    setEnvironment("");
    setIsFormOpen(false);
  };

  const toggleCategory = (cat: string) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f7f4] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-[#1a4a28]/10"
        >
          <div className="text-center mb-8">
            <span className="text-4xl">🌿</span>
            <h1 className="font-playfair text-3xl font-bold text-[#1a4a28] mt-4">Urban Leaf</h1>
            <p className="text-gray-500 mt-2">Admin Dashboard Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1a4a28] mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554] bg-[#f4f7f4]/50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1a4a28] hover:bg-[#3b8554] text-white py-4 rounded-xl font-bold transition-all shadow-md"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#3b8554] hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-[#1a4a28] p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white rounded-full shadow-sm hover:bg-[#e2e8e4] transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-playfair text-4xl font-bold flex items-center gap-2">
                Urban Leaf Admin <Sparkles className="w-6 h-6 text-[#3b8554]" />
              </h1>
              <p className="text-gray-500 mt-1">Manage your shop inventory, products, and prices.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="bg-[#1a4a28] hover:bg-[#3b8554] text-white px-6 py-4 rounded-xl font-bold shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" /> Add Plant
            </button>
            <button
              onClick={handleLogout}
              className="p-4 bg-white hover:bg-red-50 hover:text-red-500 rounded-xl shadow-sm transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Admin Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List of Plants */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-playfair text-2xl font-bold">Plants Inventory ({plantsList.length})</h2>
            {loading ? (
              <div className="flex justify-center items-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a4a28]"></div>
              </div>
            ) : plantsList.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                <p className="text-gray-500">No plants in the inventory. Click "Add Plant" to create one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plantsList.map((plant) => (
                  <div key={plant.id} className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 flex gap-4 transition-all">
                    <img src={plant.image} alt={plant.name} className="w-24 h-24 object-cover rounded-2xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{plant.name}</h3>
                      <p className="text-xs text-gray-400 italic truncate mb-2">{plant.scientificName}</p>
                      <p className="font-semibold text-[#3b8554]">LKR {plant.price.toLocaleString()}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(plant)}
                          className="p-2 bg-gray-100 hover:bg-[#e2e8e4] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plant.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to Add/Edit */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {isFormOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-6"
                >
                  <h2 className="font-playfair text-2xl font-bold mb-6">
                    {editingPlant ? "Edit Plant Details" : "Add New Plant"}
                  </h2>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Plant Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Monstera Deliciosa"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Scientific Name</label>
                      <input
                        type="text"
                        value={scientificName}
                        onChange={(e) => setScientificName(e.target.value)}
                        placeholder="e.g. Monstera deliciosa"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Price (LKR) *</label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 8500"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]"
                      />
                    </div>

                    {/* Image Upload Input */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Upload Custom Image</label>
                      <div className="flex items-center gap-4 mb-4">
                        <label className="flex-1 flex flex-col items-center justify-center px-4 py-5 bg-[#f4f7f4]/50 hover:bg-[#e2e8e4]/50 text-gray-500 rounded-xl border border-dashed border-gray-300 cursor-pointer transition-colors relative min-h-[80px]">
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a4a28]"></div>
                              <span className="text-[10px]">Uploading to ImgBB...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <Upload className="w-5 h-5 text-gray-400" />
                              <span className="text-xs font-semibold">Click to upload photo</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                        {imageUrl && (
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0">
                            <img src={imageUrl} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preset Image Selectors */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Or Choose from Presets</label>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {PRESET_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImageUrl(img)}
                            className={`h-12 w-full rounded-lg overflow-hidden border-2 ${
                              imageUrl === img ? "border-[#3b8554]" : "border-transparent"
                            }`}
                          >
                            <img src={img} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Or paste direct image URL..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554] text-xs"
                      />
                    </div>

                    {/* Categories */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {["Indoor Spaces", "Low Maintenance", "Office"].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              categories.includes(cat)
                                ? "bg-[#3b8554]/10 border-[#3b8554] text-[#3b8554]"
                                : "bg-white border-gray-200 text-gray-500"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Care Details */}
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold text-sm">Care Instructions</h3>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Sunlight</label>
                        <input
                          type="text"
                          value={sunlight}
                          onChange={(e) => setSunlight(e.target.value)}
                          placeholder="e.g. Bright, indirect light"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Watering</label>
                        <input
                          type="text"
                          value={watering}
                          onChange={(e) => setWatering(e.target.value)}
                          placeholder="e.g. Every 1-2 weeks"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Environment</label>
                        <input
                          type="text"
                          value={environment}
                          onChange={(e) => setEnvironment(e.target.value)}
                          placeholder="e.g. Humid & Warm"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]"
                        />
                      </div>
                    </div>

                    {/* Form actions */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-[#1a4a28] hover:bg-[#3b8554] text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" /> Save
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3.5 bg-gray-100 hover:bg-[#e2e8e4] rounded-xl font-bold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
