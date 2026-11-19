"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { AppCard } from "@/components/app-card";
import { APPS, CATEGORIES, type AppCategory } from "@/lib/apps";

export function Catalog() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<AppCategory | "Toutes">("Toutes");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return APPS.filter((a) => (cat === "Toutes" || a.category === cat) && (!q || `${a.name} ${a.tagline} ${a.tags.join(" ")} ${a.category}`.toLowerCase().includes(q)));
  }, [query, cat]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["Toutes", ...CATEGORIES] as const).map((c) => {
            const count = c === "Toutes" ? APPS.length : APPS.filter((a) => a.category === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${cat === c ? "text-white" : "text-zinc-400 hover:text-white"}`}
              >
                {cat === c && <motion.span layoutId="catalog-pill" className="absolute inset-0 rounded-full border border-violet-400/40 bg-violet-500/15" />}
                <span className="relative">
                  {c} <span className="text-xs text-zinc-500">{count}</span>
                </span>
              </button>
            );
          })}
        </div>
        <label className="relative block w-full lg:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une application, un usage…" className="input !rounded-full !pl-11" />
        </label>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {list.map((app, i) => (
            <motion.div
              key={app.slug}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, delay: Math.min(i, 8) * 0.035, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
            >
              <AppCard app={app} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {list.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center text-zinc-400">
          <SearchX className="h-10 w-10 text-zinc-600" />
          <p className="mt-4">Aucune application ne correspond à « {query} ».</p>
          <p className="text-sm text-zinc-500">De nouvelles applications sont ajoutées chaque mois.</p>
        </div>
      )}
    </div>
  );
}
