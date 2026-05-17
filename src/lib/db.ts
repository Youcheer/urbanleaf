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

const getLocalPlants = (): Plant[] => {
  if (typeof window === "undefined") return mockPlants;
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!local) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockPlants));
    return mockPlants;
  }
  const parsed = JSON.parse(local);
  return parsed.map((p: any) => ({
    ...p,
    description: p.description || "",
    images: p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
  }));
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
      const seenKeys = new Set<string>();
      const duplicatesToDelete: string[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const name = (data.name || "").trim().toLowerCase();
        const price = data.price || 0;
        const key = `${name}_${price}`;

        if (seenKeys.has(key)) {
          // Duplicate found! Keep track of it so we can delete it from Firestore
          duplicatesToDelete.push(docSnap.id);
        } else {
          seenKeys.add(key);
          plantsList.push({
            id: docSnap.id,
            name: data.name || "",
            scientificName: data.scientificName || "",
            description: data.description || "",
            price: data.price || 0,
            images: data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []),
            category: data.category || [],
            care: data.care || { sunlight: "", watering: "", environment: "" },
          });
        }
      });

      // Automatically clean up duplicate documents from Firestore in the background
      if (duplicatesToDelete.length > 0) {
        console.log("Cleaning up duplicate plant IDs from Firestore:", duplicatesToDelete);
        duplicatesToDelete.forEach(async (dupId) => {
          try {
            await deleteDoc(doc(db!, "plants", dupId));
          } catch (e) {
            console.error("Failed to delete duplicate document:", dupId, e);
          }
        });
      }

      // --- AUTOMATIC FIRST-TIME MIGRATION FROM LOCALSTORAGE TO FIRESTORE ---
      if (plantsList.length === 0) {
        const localPlants = getLocalPlants();
        const customLocalPlants = localPlants.filter(
          (p) => !p.id.startsWith("p1") && !p.id.startsWith("p2")
        );

        if (customLocalPlants.length > 0) {
          console.log("Found custom plants in LocalStorage. Migrating to Firestore...", customLocalPlants);
          
          const migratedNames = new Set<string>();
          for (const localPlant of customLocalPlants) {
            const plantKey = localPlant.name.trim().toLowerCase();
            // Prevent migrating duplicates from local storage during React StrictMode double runs
            if (!migratedNames.has(plantKey)) {
              migratedNames.add(plantKey);
              const { id, ...plantData } = localPlant;
              await addDoc(collection(db!, "plants"), plantData);
            }
          }

          const newSnapshot = await getDocs(q);
          const newPlantsList: Plant[] = [];
          newSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            newPlantsList.push({
              id: docSnap.id,
              name: data.name || "",
              scientificName: data.scientificName || "",
              description: data.description || "",
              price: data.price || 0,
              images: data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []),
              category: data.category || [],
              care: data.care || { sunlight: "", watering: "", environment: "" },
            });
          });
          return newPlantsList;
        }
      }
      // -------------------------------------------------------------

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
      const docRef = await addDoc(collection(db!, "plants"), plant);
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
      const docRef = doc(db!, "plants", id);
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
      const docRef = doc(db!, "plants", id);
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
