"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getArticles } from "../../lib/db";
import { Article } from "../../lib/data";
import Link from "next/link";
import { motion } from "framer-motion";
import { LeafLoader } from "../../components/LeafLoader";

export default function CareGuidesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen bg-surface-container-lowest pb-24">
      <Navbar />
      
      <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-playfair text-display-md md:text-display-lg text-primary dark:text-on-surface mb-4">
            Blog & Guides
          </h1>
          <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl">
            Discover expert tips, successful gardening experiences, and comprehensive guides to help your indoor jungle thrive.
          </p>
        </div>

        {loading ? (
          <LeafLoader />
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 font-sans">No guides published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col bg-white dark:bg-surface rounded-[var(--radius-leaf)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-white/10"
              >
                <Link href={`/care-guides/${article.slug}`} className="flex flex-col h-full">
                  <div className="w-full h-56 relative overflow-hidden">
                    {article.featuredImage ? (
                      <img 
                        src={article.featuredImage} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-surface-container flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-accent tracking-wider uppercase mb-3">
                      Guide
                    </span>
                    <h2 className="font-playfair text-xl font-bold text-primary dark:text-on-surface mb-3 line-clamp-2">
                      {article.title}
                    </h2>
                    
                    {/* Extract a small snippet from HTML content if possible, or leave it blank. We just show title to keep it clean */}
                    
                    <div className="mt-auto pt-4 flex justify-between items-center text-sm font-sans text-gray-500 dark:text-gray-400">
                      <span>{article.author || "Urban Leaf"}</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
