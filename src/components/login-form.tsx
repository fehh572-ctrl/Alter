"use client";

import { OFFER } from "@/lib/offer";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, KeyRound, LoaderCircle, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export function LoginForm({ next, notice }: { next: string; notice?: string | null }) {
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatKey = (v: string) => {
    const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const body = raw.startsWith("ALT") ? raw.slice(3) : raw;
    const parts = body.slice(0, 12).match(/.{1,4}/g) ?? [];
    return parts.length ? `ALT-${parts.join("-")}` : raw.startsWith("A") ? raw.slice(0, 3) : "";
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, accessKey: key }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "Connexion impossible.");
      window.location.href = next;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass rounded-3xl p-7 sm:p-9">
      {notice && <p className="mb-5 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{notice}</p>}
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-400">E-mail utilisé lors de la commande</span>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" autoComplete="email" className="input !pl-11" />
        </div>
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm text-zinc-400">Clé d&apos;accès</span>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input required value={key} onChange={(e) => setKey(formatKey(e.target.value))} placeholder="ALT-XXXX-XXXX-XXXX" autoComplete="off" spellCheck={false} className="input !pl-11 font-mono tracking-wider" />
        </div>
      </label>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {loading ? "Connexion…" : "Accéder à mon espace"}
      </button>
      <p className="mt-6 text-center text-sm text-zinc-400">
        Pas encore d&apos;Alter ?{" "}
        <Link href="/commander" className="font-semibold text-violet-300 hover:text-white">
          Commander pour {OFFER.priceShort}
        </Link>
      </p>
    </motion.form>
  );
}
