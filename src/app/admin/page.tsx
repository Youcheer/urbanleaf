"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Save, Sparkles, Upload, X } from "lucide-react";
import { getPlants, addPlant, updatePlant, deletePlant } from "../../lib/db";
import { Plant } from "../../lib/data";
import Link from "next/link";

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
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>(["Indoor Spaces"]);
  const [sunlight, setSunlight] = useState("");
  const [watering, setWatering] = useState("");
  const [environment, setEnvironment] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  useEffect(() => {
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
    setDescription(plant.description || "");
    setPrice(plant.price.toString());
    
    // Support legacy data structure
    const plantImages = plant.images && plant.images.length > 0 ? plant.images : (plant.image ? [plant.image] : []);
    setImages(plantImages);
    
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

    if (images.length >= 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    setUploading(true);

    try {
      const compressedBlob = await compressImage(file, 800, 0.75);
      
      const formData = new FormData();
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
        setImages((prev) => [...prev, result.data.url]);
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

  const removeImage = (idxToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || images.length === 0) {
      alert("Please fill in required fields and upload at least 1 image.");
      return;
    }

    const plantData = {
      name,
      scientificName,
      description,
      price: parseFloat(price),
      images,
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
    setDescription("");
    setPrice("");
    setImages([]);
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
          <div className="text-center mb-8 flex flex-col items-center">
            <img src="/logo.png" alt="Urban Leaf Logo" className="h-20 w-auto object-contain mb-4" />
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
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Urban Leaf Logo" className="h-16 w-auto object-contain" />
              <div>
                <h1 className="font-playfair text-2xl font-bold text-[#1a4a28] flex items-center gap-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your shop inventory, products, and prices.</p>
              </div>
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
                {plantsList.map((plant) => {
                  const mainImg = plant.images && plant.images.length > 0 ? plant.images[0] : (plant as any).image;
                  return (
                    <div key={plant.id} className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 flex gap-4 transition-all">
                      <img src={mainImg} alt={plant.name} className="w-24 h-24 object-cover rounded-2xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate uppercase">{plant.name}</h3>
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
                  );
                })}
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
                      <label className="block text-sm font-semibold mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write a small description about this plant..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554] resize-none"
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

                    {/* Image Upload Input (Up to 3 images) */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Images (Max 3) *</label>
                      
                      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                        {images.map((imgUrl, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0 group">
                            <img src={imgUrl} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {images.length < 3 && (
                        <label className="flex-1 flex flex-col items-center justify-center px-4 py-5 bg-[#f4f7f4]/50 hover:bg-[#e2e8e4]/50 text-gray-500 rounded-xl border border-dashed border-gray-300 cursor-pointer transition-colors relative min-h-[80px]">
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a4a28]"></div>
                              <span className="text-[10px]">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <Upload className="w-5 h-5 text-gray-400" />
                              <span className="text-xs font-semibold">Click to upload photo ({images.length}/3)</span>
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
                      )}
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
