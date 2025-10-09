import localforage from "localforage";

/**
 * ✅ Set any data in localforage
 * @param key - unique key (string)
 * @param value - data to store (any type)
 */
export async function setItem(key: string, value: any): Promise<void> {
  try {
    await localforage.setItem(key, value);
    console.log(`✅ Data stored successfully with key: "${key}"`);
  } catch (error) {
    console.error(`❌ Failed to set data for key "${key}":`, error);
    throw error;
  }
}

/**
 * ✅ Get data from localforage
 * @param key - key to fetch
 * @returns The stored value or null if not found
 */
export async function getItem<T = any>(key: string): Promise<T | null> {
  try {
    const data = await localforage.getItem<T>(key);
    console.log(`📦 Data fetched for key: "${key}"`, data);
    return data;
  } catch (error) {
    console.error(`❌ Failed to get data for key "${key}":`, error);
    return null;
  }
}

export async function saveBlobToCache(key: string, blob: Blob) {
  try {
    await localforage.setItem(key, blob);
    console.log("✅ File cached:", key);
  } catch (err) {
    console.error("❌ Failed to cache file:", err);
  }
}

export async function getBlobFromCache(key: string): Promise<Blob | null> {
  try {
    const blob = await localforage.getItem<Blob>(key);
    if (blob) console.log("📦 Loaded from cache:", key);
    return blob || null;
  } catch (err) {
    console.error("❌ Failed to load from cache:", err);
    return null;
  }
}
