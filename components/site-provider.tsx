"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { browserRepository } from "@/lib/storage";
import { createSampleData } from "@/lib/seed";
import type { SiteData } from "@/lib/types";

type SiteContext = {
  data: SiteData;
  saving: boolean;
  mutate: (change: (current: SiteData) => SiteData) => Promise<void>;
};
const Context = createContext<SiteContext | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const current = useRef<SiteData | null>(null);
  const locked = useRef(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const stored = await browserRepository.load();
      const loaded = stored ?? createSampleData();
      if (!stored) await browserRepository.save(loaded);
      current.current = loaded;
      setData(loaded);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load browser data.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function mutate(change: (current: SiteData) => SiteData) {
    if (!current.current || locked.current) throw new Error("Another change is being saved. Please try again in a moment.");
    locked.current = true;
    setSaving(true);
    try {
      const next = change(current.current);
      await browserRepository.save(next);
      current.current = next;
      setData(next);
    } finally {
      locked.current = false;
      setSaving(false);
    }
  }

  if (!data) return (
    <main className="startup" id="main-content">
      <span className="brand-mark">J<span>.</span></span>
      {error ? <div className="startup-message"><h1>Let’s get your site open</h1><p className="form-error" role="alert">{error}</p><button className="button primary" onClick={() => void load()}>Try again</button></div> : <div className="startup-message" aria-busy="true" aria-label="Loading your site"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-card" /></div>}
    </main>
  );
  return <Context.Provider value={{ data, saving, mutate }}>{children}</Context.Provider>;
}

export function useSite() {
  const context = useContext(Context);
  if (!context) throw new Error("useSite must be inside SiteProvider");
  return context;
}
