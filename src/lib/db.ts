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
import { Plant, plants as mockPlants, articles as mockArticles, mockReviews, Review, Article } from "./data";

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

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const name = (data.name || "").trim().toLowerCase();
        const price = data.price || 0;
        const key = `${name}_${price}`;

        // Keep local in-memory deduplication if desired, but do NOT delete from Firestore!
        if (!seenKeys.has(key)) {
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
      console.error("CRITICAL: Error fetching from Firestore. Falling back to LocalStorage.", error);
      console.warn("Please check your Firestore Security Rules (they may have expired) and ensure that your Environment Variables are configured on your hosting provider.");
      return getLocalPlants();
    }
  } else {
    console.warn("Firebase is not configured. Falling back to LocalStorage.");
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

const getLocalArticles = (): Article[] => {
  if (typeof window === "undefined") return mockArticles;
  const local = localStorage.getItem(LOCAL_ARTICLES_KEY);
  if (!local) {
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(mockArticles));
    return mockArticles;
  }
  return JSON.parse(local);
};

const saveLocalArticles = (articles: Article[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(articles));
};

export const getArticles = async (): Promise<Article[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Article[] = [];
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

      // --- AUTOMATIC FIRST-TIME MIGRATION FROM LOCALSTORAGE TO FIRESTORE ---
      if (list.length === 0) {
        const localArticles = getLocalArticles();
        const customLocalArticles = localArticles.filter(
          (a) => !a.id.startsWith("a1") && !a.id.startsWith("a2")
        );

        if (customLocalArticles.length > 0) {
          console.log("Found custom articles in LocalStorage. Migrating to Firestore...", customLocalArticles);
          
          const migratedSlugs = new Set<string>();
          for (const localArticle of customLocalArticles) {
            const articleSlug = localArticle.slug.trim().toLowerCase();
            // Prevent migrating duplicates
            if (!migratedSlugs.has(articleSlug)) {
              migratedSlugs.add(articleSlug);
              const { id, ...articleData } = localArticle;
              await addDoc(collection(db!, "articles"), articleData);
            }
          }

          const newSnapshot = await getDocs(q);
          const newList: Article[] = [];
          newSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            newList.push({
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
          return newList;
        }
      }
      // -------------------------------------------------------------

      return list;
    } catch (error) {
      console.error("CRITICAL: Error fetching articles from Firestore. Falling back to LocalStorage.", error);
      console.warn("Please check your Firestore Security Rules (they may have expired) and ensure that your Environment Variables are configured on your hosting provider.");
      return getLocalArticles();
    }
  } else {
    return getLocalArticles().sort((a, b) => b.createdAt - a.createdAt);
  }
};

export const addArticle = async (article: Omit<Article, "id">): Promise<string> => {
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

export const updateArticle = async (id: string, article: Omit<Article, "id">): Promise<void> => {
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

// --- REVIEWS DB LOGIC ---

const LOCAL_REVIEWS_KEY = "urbanleaf_reviews";

const getLocalReviews = (): Review[] => {
  if (typeof window === "undefined") return mockReviews;
  const local = localStorage.getItem(LOCAL_REVIEWS_KEY);
  if (!local) {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(mockReviews));
    return mockReviews;
  }
  return JSON.parse(local);
};

const saveLocalReviews = (reviews: Review[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
};

export const getReviewsForPlant = async (plantId: string): Promise<Review[]> => {
  if (isFirebaseConfigured && db) {
    try {
      // Simplified query without complex index for now
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Review[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.plantId === plantId) {
          list.push({
            id: docSnap.id,
            plantId: data.plantId,
            author: data.author || "Anonymous",
            rating: data.rating || 5,
            comment: data.comment || "",
            createdAt: data.createdAt || 0,
          });
        }
      });
      return list;
    } catch (error) {
      console.error("CRITICAL: Error fetching reviews from Firestore. Falling back to LocalStorage.", error);
      console.warn("Please check your Firestore Security Rules (they may have expired) and ensure that your Environment Variables are configured on your hosting provider.");
      return getLocalReviews().filter(r => r.plantId === plantId).sort((a, b) => b.createdAt - a.createdAt);
    }
  } else {
    return getLocalReviews().filter(r => r.plantId === plantId).sort((a, b) => b.createdAt - a.createdAt);
  }
};

export const addReview = async (review: Omit<Review, "id">): Promise<string> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db!, "reviews"), review);
      return docRef.id;
    } catch (error) {
      console.error("Error adding review to Firestore:", error);
      throw error;
    }
  } else {
    const local = getLocalReviews();
    const newId = "r_" + Date.now();
    const newReview = { ...review, id: newId };
    saveLocalReviews([...local, newReview]);
    return newId;
  }
};


