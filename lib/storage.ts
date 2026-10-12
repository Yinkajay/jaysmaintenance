import type { SiteData } from "./types";

const DB_NAME = "jays-site-activity";
const STORE = "site";
export interface SiteRepository {
  load(): Promise<SiteData | null>;
  save(data: SiteData): Promise<void>;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error("Browser storage is unavailable. Try a regular browser window with storage enabled."));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Could not open browser storage. Check your browser privacy settings and retry."));
    request.onblocked = () => reject(new Error("Close other tabs of this app, then retry."));
  });
}

/** Browser-only demo adapter. Replace with authenticated server operations for shared use. */
export const browserRepository: SiteRepository = {
  async load() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, "readonly");
      const request = transaction.objectStore(STORE).get("data");
      transaction.oncomplete = () => {
        db.close();
        const data = request.result as SiteData | undefined;
        if (data && data.version !== 1) return reject(new Error("This saved demo uses an unsupported data version."));
        resolve(data ?? null);
      };
      transaction.onabort = transaction.onerror = () => { db.close(); reject(new Error("Could not read your saved site. Please retry.")); };
    });
  },
  async save(data) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).put(data, "data");
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onabort = transaction.onerror = () => {
        db.close();
        reject(new Error("Could not save in this browser. Storage may be full. Try a smaller photo or free up browser storage."));
      };
    });
  },
};
