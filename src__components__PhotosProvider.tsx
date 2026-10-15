"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Photos of cooked dishes. Two sources:
 * 1. Your own photo, taken with the phone camera. It is kept on this phone only (in the browser's storage).
 * 2. A shared photo file named after the recipe id, e.g. /photos/R-CT-001.jpg, uploaded with the app.
 */
const DB = "family-table-photos";
const STORE = "photos";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadAll(): Promise<Record<string, string>> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const out: Record<string, string> = {};
    const req = db.transaction(STORE).objectStore(STORE).openCursor();
    req.onsuccess = () => {
      const c = req.result;
      if (c) { out[String(c.key)] = String(c.value); c.continue(); } else resolve(out);
    };
    req.onerror = () => reject(req.error);
  });
}

async function put(id: string, value: string | null): Promise<void> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    if (value === null) tx.objectStore(STORE).delete(id); else tx.objectStore(STORE).put(value, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Shrink a photo to at most 900 px wide so it stays small on the phone. */
function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 900 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read the photo")); };
    img.src = url;
  });
}

interface Ctx {
  mine: Record<string, string>;
  addPhoto: (id: string, file: File) => Promise<void>;
  removePhoto: (id: string) => Promise<void>;
}
const PhotosContext = createContext<Ctx | null>(null);

export function PhotosProvider({ children }: { children: React.ReactNode }) {
  const [mine, setMine] = useState<Record<string, string>>({});
  useEffect(() => {
    if (typeof indexedDB === "undefined") return;
    loadAll().then(setMine).catch(() => { /* storage not available: photos simply do not show */ });
  }, []);
  const addPhoto = useCallback(async (id: string, file: File) => {
    const data = await shrink(file);
    await put(id, data);
    setMine((m) => ({ ...m, [id]: data }));
  }, []);
  const removePhoto = useCallback(async (id: string) => {
    await put(id, null);
    setMine((m) => { const n = { ...m }; delete n[id]; return n; });
  }, []);
  return <PhotosContext.Provider value={{ mine, addPhoto, removePhoto }}>{children}</PhotosContext.Provider>;
}

export function usePhotos(): Ctx {
  const c = useContext(PhotosContext);
  if (!c) throw new Error("usePhotos must be used inside PhotosProvider");
  return c;
}

/** Small picture for lists: your photo, else the shared photo, else the emoji. */
export function Thumb({ id, emoji, size = 72 }: { id: string; emoji: string; size?: number }) {
  const { mine } = usePhotos();
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };
  const src = mine[id] ?? (failed ? undefined : `/photos/${id}.jpg`);
  if (!src) return <span className="flex shrink-0 items-center justify-center rounded-xl bg-stone-100 text-4xl" style={style} aria-hidden>{emoji}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="shrink-0 rounded-xl object-cover" style={style} />;
}

/** Big picture on the cooking page, with buttons to add or remove your own photo. */
export function RecipePhoto({ id, name, emoji }: { id: string; name: string; emoji: string }) {
  const { mine, addPhoto, removePhoto } = usePhotos();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const src = mine[id] ?? (failed ? undefined : `/photos/${id}.jpg`);
  return (
    <div className="space-y-2 no-print">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Photo of ${name}`} onError={() => setFailed(true)} className="max-h-72 w-full rounded-2xl object-cover" />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-2xl bg-stone-100 text-6xl" aria-hidden>{emoji}</div>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-xl border-2 border-emerald-700 px-4 py-3 text-lg font-semibold text-emerald-800">
          {busy ? "Saving…" : mine[id] ? "📷 Change my photo" : "📷 Add my photo"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              setBusy(true); setError("");
              try { await addPhoto(id, f); } catch { setError("Sorry, that photo could not be saved."); }
              setBusy(false);
            }}
          />
        </label>
        {mine[id] && <button onClick={() => removePhoto(id)} className="rounded-xl border-2 border-stone-300 px-4 py-3 text-lg font-semibold">Remove my photo</button>}
      </div>
      <p className="text-sm text-stone-600">Your photo stays on this phone only.</p>
      {error && <p className="text-base text-red-800">{error}</p>}
    </div>
  );
}
