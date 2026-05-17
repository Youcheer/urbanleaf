export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  image: string;
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
    price: 8500,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&q=80&w=800",
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
    price: 4500,
    image: "https://images.unsplash.com/photo-1599421487840-02c34fc07df0?auto=format&fit=crop&q=80&w=800",
    category: ["Low Maintenance", "Office", "Indoor Spaces"],
    care: {
      sunlight: "Low to bright light",
      watering: "Every 2-3 weeks",
      environment: "Adaptable",
    },
  },
  {
    id: "p3",
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    price: 12500,
    image: "https://images.unsplash.com/photo-1597055905091-88981f337f7a?auto=format&fit=crop&q=80&w=800",
    category: ["Indoor Spaces"],
    care: {
      sunlight: "Bright, indirect light",
      watering: "Every 1-2 weeks",
      environment: "Stable temperature",
    },
  },
  {
    id: "p4",
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    price: 6000,
    image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=800",
    category: ["Low Maintenance", "Office"],
    care: {
      sunlight: "Low to bright light",
      watering: "Every 2-3 weeks",
      environment: "Adaptable",
    },
  },
  {
    id: "p5",
    name: "Peace Lily",
    scientificName: "Spathiphyllum",
    price: 5500,
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800",
    category: ["Indoor Spaces", "Office"],
    care: {
      sunlight: "Low to medium indirect light",
      watering: "Weekly",
      environment: "Humid",
    },
  },
  {
    id: "p6",
    name: "Bambino Red",
    scientificName: "Alocasia amazonica",
    price: 7500,
    image: "https://images.unsplash.com/photo-1598880940080-c97a5f6e80b2?auto=format&fit=crop&q=80&w=800",
    category: ["Indoor Spaces"],
    care: {
      sunlight: "Bright, indirect light",
      watering: "Keep soil moist",
      environment: "High humidity",
    },
  },
];
