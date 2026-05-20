"use client";

import React, { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

export const ShareButtons = ({ title }: { title: string }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareWA = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  if (!url) return null;

  return (
    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
      <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
        <Share2 className="w-4 h-4" /> Share:
      </span>
      <button onClick={shareFB} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition-colors flex items-center justify-center font-bold text-xs w-8 h-8">
        FB
      </button>
      <button onClick={shareWA} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors flex items-center justify-center font-bold text-xs w-8 h-8">
        WA
      </button>
      <button onClick={shareTwitter} className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-full transition-colors flex items-center justify-center font-bold text-xs w-8 h-8">
        X
      </button>
    </div>
  );
};
