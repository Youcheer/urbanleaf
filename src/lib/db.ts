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
import { Plant, plants as mockPlants, articles as mockArticles } from "./data";

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
    isSold: p.isSold || false,
    createdAt: p.createdAt || 0,
    order: p.order !== undefined ? p.order : 999,
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
            isSold: data.isSold || false,
            createdAt: data.createdAt || 0,
            order: data.order !== undefined ? data.order : 999,
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
              isSold: data.isSold || false,
              createdAt: data.createdAt || 0,
              order: data.order !== undefined ? data.order : 999,
            });
          });
          return newPlantsList.sort((a, b) => {
            const orderA = a.order ?? 999;
            const orderB = b.order ?? 999;
            if (orderA !== orderB) return orderA - orderB;
            return (b.createdAt ?? 0) - (a.createdAt ?? 0);
          });
        }
      }
      // -------------------------------------------------------------

      return plantsList.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      });
    } catch (error) {
      console.error("Error fetching from Firestore, falling back to LocalStorage:", error);
      return getLocalPlants();
    }
  } else {
    return getLocalPlants().sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
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
    const newPlant = { ...plant, id: newId, createdAt: plant.createdAt || Date.now() };
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

// --- ARTICLES DB LOGIC ---

const LOCAL_ARTICLES_KEY = "urbanleaf_articles";

const getLocalArticles = (): import("./data").Article[] => {
  if (typeof window === "undefined") return mockArticles;
  const local = localStorage.getItem(LOCAL_ARTICLES_KEY);
  if (!local) {
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(mockArticles));
    return mockArticles;
  }
  return JSON.parse(local);
};

const saveLocalArticles = (articles: import("./data").Article[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(articles));
};

export const getArticles = async (): Promise<import("./data").Article[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: import("./data").Article[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          slug: data.slug || "",
          title: data.title || "",
          content: data.content || "",
          author: data.author || "",
          featuredImage: data.featuredImage || "",
          createdAt: data.createdAt || 0,
          relatedProductIds: data.relatedProductIds || [],
        });
      });
      return list;
    } catch (error) {
      console.error("Error fetching articles from Firestore:", error);
      return getLocalArticles();
    }
  } else {
    return getLocalArticles().sort((a, b) => b.createdAt - a.createdAt);
  }
};

export const addArticle = async (article: Omit<import("./data").Article, "id">): Promise<string> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db!, "articles"), article);
      return docRef.id;
    } catch (error) {
      console.error("Error adding article to Firestore:", error);
      throw error;
    }
  } else {
    const local = getLocalArticles();
    const newId = "a_" + Date.now();
    const newArticle = { ...article, id: newId };
    saveLocalArticles([...local, newArticle]);
    return newId;
  }
};

export const updateArticle = async (id: string, article: Omit<import("./data").Article, "id">): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db!, "articles", id);
      await updateDoc(docRef, article as any);
    } catch (error) {
      console.error("Error updating article in Firestore:", error);
      throw error;
    }
  } else {
    const local = getLocalArticles();
    const updated = local.map((a) => (a.id === id ? { ...article, id } : a));
    saveLocalArticles(updated);
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db!, "articles", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting article from Firestore:", error);
      throw error;
    }
  } else {
    const local = getLocalArticles();
    const filtered = local.filter((a) => a.id !== id);
    saveLocalArticles(filtered);
  }
};

