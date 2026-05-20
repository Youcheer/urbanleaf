"use client";

import React, { useEffect, useState } from "react";
import { getArticles, getPlants } from "../../../lib/db";
import { Article, Plant } from "../../../lib/data";
import { Navbar } from "../../../components/Navbar";
import { ShareButtons } from "../../../components/ShareButtons";
import Link from "next/link";

export default function ArticleClient({ initialArticle, slug }: { initialArticle: Article | null, slug: string }) {
  const [article, setArticle] = useState<Article | null>(initialArticle);
  const [relatedProducts, setRelatedProducts] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(!initialArticle);

  useEffect(() => {
    if (!initialArticle) {
      // Try to fetch on client (reads localStorage)
      getArticles().then(articles => {
        const found = articles.find(a => a.slug === slug);
        setArticle(found || null);
        setLoading(false);
      });
    }
  }, [initialArticle, slug]);

  useEffect(() => {
    if (article) {
      getPlants().then(plants => {
        setRelatedProducts(plants.filter(p => article.relatedProductIds?.includes(p.id)));
      });
    }
  }, [article]);

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-container-lowest pb-24">
        <Navbar />
        <div className="pt-32 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#f4f7f4] flex flex-col items-center justify-center px-4">
        <Navbar />
        <h1 className="text-3xl font-playfair font-bold text-[#1a4a28] mb-4 mt-20">Article Not Found</h1>
        <p className="text-gray-500 mb-6">The care guide you are looking for does not exist.</p>
        <Link href="/care-guides" className="bg-[#1a4a28] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3b8554] transition-colors">
          Browse All Guides
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-container-lowest pb-24">
      <Navbar />
      
      <article className="max-w-3xl mx-auto pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <header className="mb-8">
          <Link href="/care-guides" className="text-sm font-bold text-accent uppercase tracking-wider hover:underline mb-4 inline-block">
            ← Back to Guides
          </Link>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-primary leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-sans">
            <span className="font-semibold text-primary">{article.author || "Urban Leaf Expert"}</span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="w-full h-64 md:h-[400px] rounded-[var(--radius-leaf)] overflow-hidden mb-10 shadow-md">
            <img 
              src={article.featuredImage} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg prose-green max-w-none font-sans text-on-surface-variant leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Buttons */}
        <ShareButtons title={article.title} />

        {/* Related Products CTA */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h3 className="font-playfair text-2xl font-bold text-primary mb-6">
              Shop Plants from this Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedProducts.map(product => {
                const imgUrl = product.images?.[0] || product.image;
                return (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      {imgUrl && <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary line-clamp-1">{product.name}</h4>
                      <p className="text-accent font-semibold text-sm mb-2">LKR {product.price.toLocaleString()}</p>
                      <Link 
                        href="/#shop" 
                        className="text-xs font-bold bg-[#1a4a28] text-white px-3 py-1.5 rounded-lg hover:bg-[#3b8554] transition-colors"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
