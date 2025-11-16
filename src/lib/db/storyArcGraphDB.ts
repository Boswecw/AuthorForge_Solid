/**
 * Story Arc Graph IndexedDB Wrapper
 * 
 * Provides browser-based persistence for story arc graph data
 */

import type { StoryArcGraph, StoryArcPoint, PlotBeat } from "~/routes/anvil/types/graph";

const DB_NAME = "authorforge-story-arc-graphs";
const DB_VERSION = 1;
const STORE_NAME = "graphs";

class StoryArcGraphDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (typeof window === "undefined") return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("projectId", "projectId", { unique: false });
        }
      };
    });
  }

  async get(projectId: string): Promise<StoryArcGraph | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("projectId");
      const request = index.get(projectId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async save(graph: StoryArcGraph): Promise<StoryArcGraph> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(graph);

      request.onsuccess = () => resolve(graph);
      request.onerror = () => reject(request.error);
    });
  }

  async updatePoint(
    projectId: string,
    chapter: number,
    updates: Partial<StoryArcPoint>
  ): Promise<void> {
    const graph = await this.get(projectId);
    if (!graph) throw new Error("Graph not found");

    const pointIndex = graph.points.findIndex((p) => p.chapter === chapter);
    if (pointIndex === -1) throw new Error("Point not found");

    graph.points[pointIndex] = {
      ...graph.points[pointIndex],
      ...updates,
    };
    graph.updatedAt = new Date().toISOString();

    await this.save(graph);
  }

  async updatePlotBeat(
    projectId: string,
    beatId: string,
    updates: Partial<PlotBeat>
  ): Promise<void> {
    const graph = await this.get(projectId);
    if (!graph) throw new Error("Graph not found");

    const beatIndex = graph.plotBeats.findIndex((b) => b.id === beatId);
    if (beatIndex === -1) throw new Error("Plot beat not found");

    graph.plotBeats[beatIndex] = {
      ...graph.plotBeats[beatIndex],
      ...updates,
    };
    graph.updatedAt = new Date().toISOString();

    await this.save(graph);
  }

  async addPlotBeat(projectId: string, beat: PlotBeat): Promise<void> {
    const graph = await this.get(projectId);
    if (!graph) throw new Error("Graph not found");

    graph.plotBeats.push(beat);
    graph.updatedAt = new Date().toISOString();

    await this.save(graph);
  }

  async deletePlotBeat(projectId: string, beatId: string): Promise<void> {
    const graph = await this.get(projectId);
    if (!graph) throw new Error("Graph not found");

    graph.plotBeats = graph.plotBeats.filter((b) => b.id !== beatId);
    graph.updatedAt = new Date().toISOString();

    await this.save(graph);
  }

  async clear(projectId?: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      if (projectId) {
        const index = store.index("projectId");
        const request = index.openCursor(IDBKeyRange.only(projectId));

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      } else {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }
    });
  }
}

export const storyArcGraphDB = new StoryArcGraphDB();

