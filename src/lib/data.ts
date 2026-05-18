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
    category: ["Signature Collection", "Indoor Spaces"],
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
    category: ["Collector Series", "Indoor Spaces"],
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
    price: 8500,
    images: ["https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&q=80&w=800"],
    category: ["Indoor Spaces", "Low Maintenance"],
    care: {
      sunlight: "Bright, indirect light",
      watering: "Every 1-2 weeks",
      environment: "Warm & humid",
    },
  },
  {
    id: "p4",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    description: "One of the toughest indoor plants. Known for air purification and extremely low maintenance requirements.",
    price: 4500,
    images: ["https://images.unsplash.com/photo-1599421487840-02c34fc07df0?auto=format&fit=crop&q=80&w=800"],
    category: ["Low Maintenance", "Office", "Indoor Spaces"],
    care: {
      sunlight: "Low to bright light",
      watering: "Every 2-3 weeks",
      environment: "Adaptable",
    },
  },
];
