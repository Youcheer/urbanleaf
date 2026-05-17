import { db, isFirebaseConfigured } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy 
} from "firebase/firestore";
import { Plant, plants as mockPlants } from "./data";

const LOCAL_STORAGE_KEY = "urbanleaf_plants";

// Helper to initialize local storage with mock data if empty
const getLocalPlants = (): Plant[] => {
  if (typeof window === "undefined") return mockPlants;
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!local) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockPlants));
    return mockPlants;
  }
  return JSON.parse(local);
};

const saveLocalPlants = (plants: Plant[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plants));
};

export const getPlants = async (): Promise<Plant[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "plants"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const plantsList: Plant[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        plantsList.push({
          id: docSnap.id,
          name: data.name,
          scientificName: data.scientificName,
          price: data.price,
          image: data.image,
          category: data.category,
          care: data.care,
        });
      });
      return plantsList;
    } catch (error) {
      console.error("Error fetching from Firestore, falling back to LocalStorage:", error);
      return getLocalPlants();
    }
  } else {
    return getLocalPlants();
  }
};

export const addPlant = async (plant: Omit<Plant, "id">): Promise<string> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "plants"), plant);
      return docRef.id;
    } catch (error) {
      console.error("Error adding to Firestore:", error);
      throw error;
    }
  } else {
    const local = getLocalPlants();
    const newId = "p_" + Date.now();
    const newPlant = { ...plant, id: newId };
    saveLocalPlants([...local, newPlant]);
    return newId;
  }
};

export const updatePlant = async (id: string, plant: Omit<Plant, "id">): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "plants", id);
      await updateDoc(docRef, plant as any);
    } catch (error) {
      console.error("Error updating Firestore:", error);
      throw error;
    }
  } else {
    const local = getLocalPlants();
    const updated = local.map((p) => (p.id === id ? { ...plant, id } : p));
    saveLocalPlants(updated);
  }
};

export const deletePlant = async (id: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "plants", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting from Firestore:", error);
      throw error;
    }
  } else {
    const local = getLocalPlants();
    const filtered = local.filter((p) => p.id !== id);
    saveLocalPlants(filtered);
  }
};
