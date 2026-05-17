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
    id: "p2",
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
