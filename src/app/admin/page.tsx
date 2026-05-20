"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Save, Sparkles, Upload, X } from "lucide-react";
import { getPlants, addPlant, updatePlant, deletePlant, getArticles, addArticle, updateArticle, deleteArticle } from "../../lib/db";
import { Plant, Article } from "../../lib/data";
import Link from "next/link";
import { RichTextEditor } from "../../components/RichTextEditor";

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
  const [activeTab, setActiveTab] = useState<"plants" | "articles">("plants");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Plant State
  const [plantsList, setPlantsList] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  
  // Plant Form State
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>(["Indoor Spaces"]);
  const [sunlight, setSunlight] = useState("");
  const [watering, setWatering] = useState("");
  const [environment, setEnvironment] = useState("");
  const [isSold, setIsSold] = useState(false);
  const [order, setOrder] = useState<number | "">("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Article State
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // Article Form State
  const [articleTitle, setArticleTitle] = useState("");
  const [articleSlug, setArticleSlug] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("");
  const [articleImage, setArticleImage] = useState("");
  const [articleRelatedIds, setArticleRelatedIds] = useState<string[]>([]);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);

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
      fetchArticles();
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

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticlesList(data);
    } catch (err) {
      console.error(err);
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

  // --- PLANT LOGIC ---
  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setName(plant.name);
    setScientificName(plant.scientificName);
    setDescription(plant.description || "");
    setPrice(plant.price.toString());
    const plantImages = plant.images && plant.images.length > 0 ? plant.images : (plant.image ? [plant.image] : []);
    setImages(plantImages);
    setCategories(plant.category);
    setSunlight(plant.care.sunlight);
    setWatering(plant.care.watering);
    setEnvironment(plant.care.environment);
    setIsSold(plant.isSold || false);
    setOrder(plant.order ?? "");
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isArticle = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isArticle && images.length >= 3) {
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
        if (isArticle) {
          setArticleImage(result.data.url);
        } else {
          setImages((prev) => [...prev, result.data.url]);
        }
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
      isSold,
      order: order === "" ? 999 : Number(order),
    };

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
    setIsSold(false);
    setOrder("");
    setIsFormOpen(false);
  };

  // --- ARTICLE LOGIC ---
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setArticleTitle(article.title);
    setArticleSlug(article.slug);
    setArticleContent(article.content);
    setArticleAuthor(article.author);
    setArticleImage(article.featuredImage);
    setArticleRelatedIds(article.relatedProductIds || []);
    setIsArticleFormOpen(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      await deleteArticle(id);
      fetchArticles();
    }
  };

  const resetArticleForm = () => {
    setEditingArticle(null);
    setArticleTitle("");
    setArticleSlug("");
    setArticleContent("");
    setArticleAuthor("");
    setArticleImage("");
    setArticleRelatedIds([]);
    setIsArticleFormOpen(false);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle || !articleSlug || !articleContent || !articleImage) {
      alert("Please fill in all required fields (Title, Slug, Content, Featured Image).");
      return;
    }
    const articleData = {
      title: articleTitle,
      slug: articleSlug,
      content: articleContent,
      author: articleAuthor || "Urban Leaf Expert",
      featuredImage: articleImage,
      relatedProductIds: articleRelatedIds,
      createdAt: editingArticle ? editingArticle.createdAt : Date.now()
    };

    setIsSubmitting(true);
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, articleData);
      } else {
        await addArticle(articleData);
      }
      resetArticleForm();
      fetchArticles();
    } catch (err) {
      alert("Failed to save article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArticleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setArticleTitle(title);
    if (!editingArticle) {
      // Auto-generate slug for new articles
      setArticleSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const toggleRelatedProduct = (productId: string) => {
    setArticleRelatedIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
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
                <p className="text-gray-500 text-sm mt-0.5">Manage your shop inventory and content.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (activeTab === "plants") {
                  resetForm();
                  setIsFormOpen(true);
                } else {
                  resetArticleForm();
                  setIsArticleFormOpen(true);
                }
              }}
              className="bg-[#1a4a28] hover:bg-[#3b8554] text-white px-6 py-4 rounded-xl font-bold shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" /> {activeTab === "plants" ? "Add Plant" : "Add Article"}
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

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("plants")}
            className={`pb-4 px-4 font-bold whitespace-nowrap transition-colors ${activeTab === "plants" ? "border-b-2 border-[#1a4a28] text-[#1a4a28]" : "text-gray-400 hover:text-gray-600"}`}
          >
            Plants Inventory
          </button>
          <button 
            onClick={() => setActiveTab("articles")}
            className={`pb-4 px-4 font-bold whitespace-nowrap transition-colors ${activeTab === "articles" ? "border-b-2 border-[#1a4a28] text-[#1a4a28]" : "text-gray-400 hover:text-gray-600"}`}
          >
            Care Guides & Articles
          </button>
        </div>

        {/* Mobile FAB */}
        {((activeTab === "plants" && !isFormOpen) || (activeTab === "articles" && !isArticleFormOpen)) && (
          <button
            onClick={() => {
              if (activeTab === "plants") {
                resetForm();
                setIsFormOpen(true);
              } else {
                resetArticleForm();
                setIsArticleFormOpen(true);
              }
            }}
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-primary)] text-white rounded-[var(--radius-full)] shadow-xl flex items-center justify-center z-40 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* List Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === "plants" ? (
              // --- PLANTS LIST ---
              <>
                {loading ? (
                  <div className="flex justify-center items-center py-20 bg-white rounded-[var(--radius-leaf)] shadow-sm border border-gray-100">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
                  </div>
                ) : plantsList.length === 0 ? (
                  <div className="bg-white p-12 rounded-[var(--radius-leaf)] text-center shadow-sm border border-gray-100">
                    <p className="text-gray-500">No plants in the inventory. Click "Add Plant" to create one.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plantsList.map((plant) => {
                      const mainImg = plant.images && plant.images.length > 0 ? plant.images[0] : (plant as any).image;
                      return (
                        <div key={plant.id} className="bg-white p-5 rounded-[var(--radius-leaf-reverse)] shadow-sm hover:shadow-md border border-gray-100 flex gap-4 transition-all">
                          <img src={mainImg} alt={plant.name} className="w-24 h-24 object-cover rounded-[var(--radius-leaf)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate uppercase text-[var(--color-primary)]">{plant.name}</h3>
                            <p className="text-xs text-gray-400 italic truncate mb-2">{plant.scientificName}</p>
                            <p className="font-semibold text-[var(--color-accent)]">LKR {plant.price.toLocaleString()}</p>
                            <div className="flex gap-2 mt-4">
                              <button onClick={() => handleEdit(plant)} className="p-2 bg-gray-100 hover:bg-[var(--color-accent-container)] hover:text-[var(--color-accent)] rounded-lg transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(plant.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              // --- ARTICLES LIST ---
              <>
                {articlesList.length === 0 ? (
                  <div className="bg-white p-12 rounded-[var(--radius-leaf)] text-center shadow-sm border border-gray-100">
                    <p className="text-gray-500">No articles yet. Click "Add Article" to create your first care guide.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articlesList.map((article) => (
                      <div key={article.id} className="bg-white p-5 rounded-[var(--radius-leaf-reverse)] shadow-sm hover:shadow-md border border-gray-100 flex flex-col transition-all">
                        {article.featuredImage && (
                          <img src={article.featuredImage} alt={article.title} className="w-full h-32 object-cover rounded-xl mb-4" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg line-clamp-2 text-[var(--color-primary)]">{article.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">/{article.slug}</p>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                          <button onClick={() => handleEditArticle(article)} className="flex-1 p-2 bg-gray-100 hover:bg-[var(--color-accent-container)] hover:text-[var(--color-accent)] rounded-lg transition-colors flex justify-center items-center gap-2 font-semibold text-sm">
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => handleDeleteArticle(article.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Form Area */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              
              {/* PLANT FORM */}
              {activeTab === "plants" && isFormOpen && (
                <motion.div
                  key="plant-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed inset-0 z-50 bg-[#f4f7f4] overflow-y-auto p-6 md:p-8 md:relative md:inset-auto md:z-auto md:bg-white md:rounded-[var(--radius-leaf)] md:shadow-xl md:border md:border-gray-100 md:sticky md:top-6"
                >
                  <div className="flex justify-between items-center mb-6 mt-4 md:mt-0">
                    <h2 className="font-playfair text-2xl font-bold text-[var(--color-primary)]">
                      {editingPlant ? "Edit Plant Details" : "Add New Plant"}
                    </h2>
                    <button onClick={resetForm} className="md:hidden p-2 bg-white shadow-sm border border-gray-200 rounded-full active:scale-95">
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Plant Name *</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monstera Deliciosa" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Scientific Name</label>
                      <input type="text" value={scientificName} onChange={(e) => setScientificName(e.target.value)} placeholder="e.g. Monstera deliciosa" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a small description..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554] resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Price (LKR) *</label>
                      <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 8500" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Images (Max 3) *</label>
                      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                        {images.map((imgUrl, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0 group">
                            <img src={imgUrl} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                      {images.length < 3 && (
                        <label className="flex-1 flex flex-col items-center justify-center px-4 py-5 bg-[#f4f7f4]/50 hover:bg-[#e2e8e4]/50 text-gray-500 rounded-xl border border-dashed border-gray-300 cursor-pointer transition-colors relative min-h-[80px]">
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a4a28]"></div><span className="text-[10px]">Uploading...</span></div>
                          ) : (
                            <div className="flex flex-col items-center gap-1"><Upload className="w-5 h-5 text-gray-400" /><span className="text-xs font-semibold">Click to upload photo ({images.length}/3)</span></div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} disabled={uploading} className="hidden" />
                        </label>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#1a4a28] hover:bg-[#3b8554] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Saving...</>
                        ) : (
                          <><Save className="w-5 h-5" /> Save</>
                        )}
                      </button>
                      <button type="button" onClick={resetForm} disabled={isSubmitting} className="px-6 py-3.5 bg-gray-100 hover:bg-[#e2e8e4] disabled:opacity-50 rounded-xl font-bold transition-all">Cancel</button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ARTICLE FORM */}
              {activeTab === "articles" && isArticleFormOpen && (
                <motion.div
                  key="article-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed inset-0 z-50 bg-[#f4f7f4] overflow-y-auto p-6 md:p-8 md:relative md:inset-auto md:z-auto md:bg-white md:rounded-[var(--radius-leaf)] md:shadow-xl md:border md:border-gray-100 md:sticky md:top-6"
                >
                  <div className="flex justify-between items-center mb-6 mt-4 md:mt-0">
                    <h2 className="font-playfair text-2xl font-bold text-[var(--color-primary)]">
                      {editingArticle ? "Edit Article" : "Write New Article"}
                    </h2>
                    <button onClick={resetArticleForm} className="md:hidden p-2 bg-white shadow-sm border border-gray-200 rounded-full active:scale-95">
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveArticle} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Title *</label>
                      <input type="text" required value={articleTitle} onChange={handleArticleTitleChange} placeholder="e.g. How to care for Anthuriums" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">URL Slug *</label>
                      <input type="text" required value={articleSlug} onChange={(e) => setArticleSlug(e.target.value)} placeholder="e.g. how-to-care-for-anthuriums" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b8554]" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Featured Image *</label>
                      {articleImage ? (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 mb-2">
                          <img src={articleImage} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setArticleImage("")} className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-red-500 hover:bg-white transition-colors shadow-sm"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <label className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-[#f4f7f4]/50 hover:bg-[#e2e8e4]/50 text-gray-500 rounded-xl border border-dashed border-gray-300 cursor-pointer transition-colors relative">
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a4a28]"></div><span>Uploading...</span></div>
                          ) : (
                            <div className="flex flex-col items-center gap-2"><Upload className="w-6 h-6 text-gray-400" /><span className="text-sm font-semibold">Upload Featured Image</span></div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} disabled={uploading} className="hidden" />
                        </label>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Article Content *</label>
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <RichTextEditor value={articleContent} onChange={setArticleContent} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Link Related Products</label>
                      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-white space-y-1">
                        {plantsList.map(plant => (
                          <label key={plant.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={articleRelatedIds.includes(plant.id)}
                              onChange={() => toggleRelatedProduct(plant.id)}
                              className="w-4 h-4 text-[#1a4a28] rounded focus:ring-[#3b8554]"
                            />
                            <div className="flex items-center gap-2">
                              {plant.images?.[0] && <img src={plant.images[0]} className="w-8 h-8 rounded-md object-cover" />}
                              <span className="text-sm font-medium">{plant.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#1a4a28] hover:bg-[#3b8554] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Publishing...</>
                        ) : (
                          <><Save className="w-5 h-5" /> Publish</>
                        )}
                      </button>
                      <button type="button" onClick={resetArticleForm} disabled={isSubmitting} className="px-6 py-3.5 bg-gray-100 hover:bg-[#e2e8e4] disabled:opacity-50 rounded-xl font-bold transition-all">Cancel</button>
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
