export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  price: number;
  image?: string; // Legacy
  images: string[];
  category: string[];
  care: {
    sunlight: string;
    watering: string;
    environment: string;
  };
}

export const plants: Plant[] = [
  {
    id: "p1",
    name: "The Crimson Anthurium",
    scientificName: "Anthurium andraeanum",
    description: "A breathtaking specimen featuring brilliant, waxy spathes that provide a continuous display of vivid color against deep green, architectural foliage.",
    price: 45000,
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBZgqW4-S_YxJ6a7ZZgAAhkiSNKsB8qdNzgs1LyaYgFSOYohXkPDhDA9-tGrbD99mxAjrOgGIrFknx0rkIQpXHKRuQXOdQrObeWm52RJbiXbX7gCjKIt0wtklSlwjzXCsuT-taSWEZ2Txw1rpHwOqsjeUdD4LLuHNik4rVBJIdL7ixZV59tJJR_ZukmraT1HfGszx3_wQgVTcC6hvHUx9JWoi-EfPDfo6BSr4AGz8N4kfxLQGRrYjVnlUw1WeypLlK9Un9TlufbfDhP"],
    category: ["Rare Finds", "Interior Staples"],
    care: {
      sunlight: "Bright, indirect light",
      watering: "Every 1 week",
      environment: "Warm & humid",
    },
  },
  {
    id: "p2",
    name: "Monstera Albo",
    scientificName: "Monstera deliciosa 'Albo Borsigiana'",
    description: "A highly coveted collector's plant with stunning, large fenestrated leaves painted with large sectors of pure white variegation.",
    price: 98000,
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA10AMdkwpZK8gAVI7s0X7YJUplwr6kvNF1t-VGg3o3GX3lnSJ-h1hQXxbavsIloIa8FPAnE6iO0eEvNSsXiLizyEfC8kzDNTo4i_4NrZPe7MalF0lmSvXpiUkptKRto0w63Nqs8eHuqX9m9xLRYNwxlxI8f6MqOnRwia0iToRo9loGWljgRELmg6q5lfTEQih7cwZedndqLbR1Ok-QIHZhLA6hM98tvvJ12bIudUvm7l9YXyd4fQ3Wm2Ld3yFOy296IPshsbnzk4hN"],
    category: ["Rare Finds"],
    care: {
      sunlight: "Bright, indirect light",
      watering: "Every 1-2 weeks",
      environment: "Warm & humid",
    },
  },
  {
    id: "p3",
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    description: "A stunning tropical plant known for its large, fenestrated leaves. Perfect for adding a bold, jungle vibe to any room.",
    price: 36000,
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDZ9Z1jOyq682XUwchB1kMAnJN99UFqzsrZmIaYEuGpRzMbSGZgM5JTg2Q7du1HjDEJIbKaRINe1Vbqs16VGIxio5DECRJz9hJVV11eCk-GB18SoM1eiXcm1X_xNOi5L_L5Y8YOdUOFlyV7pVzyul3re6PhOzfn_8Rfnu0IBavP6b752IPi3OfOhBNW5RwF78OuCWZx9hJCoTqQ2bSSLLfLRM9fFyUt-AIOAHQeu-77UUZ0vEXetaRbIUmRMROQiMO89I0zm-FxBf99"],
    category: ["Interior Staples"],
    care: {
      sunlight: "Medium light",
      watering: "Every 1-2 weeks",
      environment: "Warm & humid",
    },
  },
  {
    id: "p4",
    name: "Ficus Elastica",
    scientificName: "Ficus elastica",
    description: "An elegant, architectural indoor tree with dark, glossy burgundy leaves. Perfect for adding a luxurious structural anchor to your room.",
    price: 43500,
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAGnxJm_S-zdHr0xMfCViIV1D_ad_iGq_HDtbiOwiFNVUUv6DXiGpBAUlpmQYLwDrouFBhwqB-3P1vOuqj214zN0iD-NNTHjcvPvj9iH51gHpC12aYWOTJqFb7nd-M0Jp_RueB-UAX2uYYtu_mWqxfhqtIdYvG-SknDebi0OSL_hMqXM4zzfTwZmZRvKc8yiPAV92vDs6-kkplHcq20OsNtalXiXTSuI3UO1sSoGJ2DMdD2MBViNiwjjQzCUKi0V0FiyOOlhKKb3_J3"],
    category: ["Interior Staples"],
    care: {
      sunlight: "Bright, indirect light",
      watering: "Let dry completely",
      environment: "Adaptable",
    },
  },
  {
    id: "p5",
    name: "Anthurium Magnificum",
    scientificName: "Anthurium magnificum",
    description: "Bring tropical beauty and timeless elegance to your space. This exceptional Anthurium specimen features striking, velvet-textured dark green leaves with prominent white veins that command attention. Cultivated in our specialized conservatories to ensure pristine health and longevity.",
    price: 55500,
    images: ["https://lh3.googleusercontent.com/aida/ADBb0uhlniPhb1ptGJZv0LRyb89rACzkamaW7w9HrGXqOw8hV8nULPtjCm5Xu2T-e_8KVmm3W4Tm0TOsnFowPzgXidmZYP3FXCpvtCdxDALvZkkW6WvX3vYMdNGQUP5EzQafu9upN2YIqWbhmeS_mto_HRJKX9OgTB_yE0MaTU7gLb1029RBwlXEhmxEQ3JOIITLH-Xuvd7JYBkpFtsAtc99cG8rOLB79X8wRJ7NBFZ9tPtBpTAV1aGhBMkGr8PL"],
    category: ["Rare Finds", "Interior Staples"],
    care: {
      sunlight: "Bright, indirect light",
      watering: "Every 1 week",
      environment: "Warm & humid",
    },
  },
];
