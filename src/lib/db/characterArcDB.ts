/**
 * IndexedDB wrapper for Character Arc persistence
 * 
 * Provides a robust, browser-based database for character arc data
 * with proper indexing, transactions, and error handling.
 */

import type { CharacterArc } from "~/routes/anvil/types";

const DB_NAME = "AuthorForgeDB";
const DB_VERSION = 1;
const STORE_NAME = "characterArcs";

class CharacterArcDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          
          // Create indexes for efficient querying
          store.createIndex("projectId", "projectId", { unique: false });
          store.createIndex("name", "name", { unique: false });
          store.createIndex("role", "role", { unique: false });
          store.createIndex("povStatus", "povStatus", { unique: false });
        }
      };
    });
  }

  async getAll(projectId: string): Promise<CharacterArc[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("projectId");
      const request = index.getAll(projectId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async get(id: string): Promise<CharacterArc | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async save(arc: CharacterArc): Promise<CharacterArc> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      // Update timestamp
      const arcToSave = {
        ...arc,
        updatedAt: new Date().toISOString(),
      };

      const request = store.put(arcToSave);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(arcToSave);
    });
  }

  async delete(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(projectId?: string): Promise<void> {
    if (!this.db) await this.init();

    if (!projectId) {
      // Clear all
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } else {
      // Clear by project
      const arcs = await this.getAll(projectId);
      const promises = arcs.map(arc => this.delete(arc.id));
      await Promise.all(promises);
    }
  }

  async count(projectId?: string): Promise<number> {
    if (!this.db) await this.init();

    if (!projectId) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.count();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    } else {
      const arcs = await this.getAll(projectId);
      return arcs.length;
    }
  }
}

// Singleton instance
export const characterArcDB = new CharacterArcDB();

