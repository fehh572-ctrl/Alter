"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, CreditCard, LoaderCircle, Lock, PartyPopper, ShieldCheck, Smartphone, Sparkles, WandSparkles, Zap } from "lucide-react";
import { useState, type FormEvent } from "react";
import { OFFER, priceBreakdown } from "@/lib/offer";

type Phase = "form" | "processing" | "success";

const PROCESS_STEPS = ["Vérification du paiement", "Création de votre espace", "Attribution de votre numéro", "Activation de la réception des SMS"];

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function brand(num: string) {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "MASTERCARD";
  if (/^3[47]/.test(n)) return "AMEX";
  return "";
}

export function CheckoutForm({ stripeEnabled, demoEnabled, notice }: { stripeEnabled: boolean; demoEnabled: boolean; notice?: string | null }) {
  const paymentUnavailable = !stripeEnabled && !demoEnabled;
  const price = priceBreakdown();
  const [phase, setPhase] = useState<Phase>("form");
  const [step, setStep] = useState(0);
  const [error, setError] = useState<{ message: string; field?: string } | null>(notice ? { message: notice } : null);
  const [number, setNumber] = useState("");
  const [form, setForm] = useState({ name: "", email: "", card: "", expiry: "", cvc: "", accept: false });

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const fillDemo = () =>
    setForm((f) => ({
      ...f,
      name: f.name || "Camille Martin",
      email: f.email || `camille.${Math.floor(Math.random() * 9000 + 1000)}@exemple.fr`,
      card: "4242 4242 4242 4242",
      expiry: "12/30",
      cvc: "123",
      accept: true,
    }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!stripeEnabled) {
      setPhase("processing");
      setStep(0);
    }
    const started = Date.now();
    const timer = stripeEnabled ? null : setInterval(() => setStep((s) => Math.min(s + 1, PROCESS_STEPS.length - 1)), 650);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          accept: form.accept,
          card: { number: form.card, expiry: form.expiry, cvc: form.cvc },
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; field?: string; redirect?: string; external?: boolean; number?: string };
      if (!data.ok) throw Object.assign(new Error(data.error ?? "Une erreur est survenue."), { field: data.field });
      if (data.external && data.redirect) {
        window.location.href = data.redirect;
        return;
      }
      const elapsed = Date.now() - started;
      await new Promise((r) => setTimeout(r, Math.max(0, 2700 - elapsed)));
      if (timer) clearInterval(timer);
      setStep(PROCESS_STEPS.length);
      setNumber(data.number ?? "");
      await new Promise((r) => setTimeout(r, 450));
      setPhase("success");
    } catch (err) {
      if (timer) clearInterval(timer);
      const e2 = err as Error & { field?: string };
      setError({ message: e2.message, field: e2.field });
      setPhase("form");
    }
  };

  const fieldClass = (f: string) => `input ${error?.field === f ? "!border-rose-400/70" : ""}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div className="relative">
        <AnimatePresence mode="wait">
          {phase === "form" && (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="glass rounded-3xl p-6 sm:p-9"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">1. Vos informations</h2>
                {demoEnabled && !stripeEnabled && (
                  <button type="button" onClick={fillDemo} className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-200 transition-colors hover:bg-violet-500/20">
                    <WandSparkles className="h-3.5 w-3.5" /> Remplir (démo)
                  </button>
                )}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-zinc-400">Nom complet</span>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Camille Martin" autoComplete="name" className={fieldClass("name")} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-zinc-400">E-mail</span>
                  <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vous@exemple.fr" autoComplete="email" className={fieldClass("email")} />
                </label>
              </div>

              <h2 className="mt-9 text-lg font-semibold text-white">2. Paiement</h2>
              {stripeEnabled ? (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
                  <Lock className="h-5 w-5 text-emerald-300" /> Vous serez redirigé vers la page de paiement sécurisée Stripe.
                </div>
              ) : paymentUnavailable ? (
                <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/[0.06] p-4 text-sm text-amber-100">
                  Les commandes ouvrent très bientôt. Le paiement en ligne n&apos;est pas encore activé.
                </div>
              ) : (
                <>
                  <div className="mt-4 space-y-4">
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-zinc-400">Numéro de carte</span>
                      <div className="relative">
                        <input
                          required
                          inputMode="numeric"
                          value={form.card}
                          onChange={(e) => set("card", formatCard(e.target.value))}
                          placeholder="4242 4242 4242 4242"
                          autoComplete="cc-number"
                          className={`${fieldClass("number")} pr-28 font-mono tracking-wider`}
                        />
                        <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-[11px] font-bold tracking-wider text-zinc-400">
                          {brand(form.card) || <CreditCard className="h-4 w-4" />}
                        </span>
                      </div>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="mb-1.5 block text-sm text-zinc-400">Expiration</span>
                        <input required inputMode="numeric" value={form.expiry} onChange={(e) => set("expiry", formatExpiry(e.target.value))} placeholder="MM/AA" autoComplete="cc-exp" className={`${fieldClass("expiry")} font-mono`} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-sm text-zinc-400">Cryptogramme</span>
                        <input required inputMode="numeric" value={form.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" autoComplete="cc-csc" className={`${fieldClass("cvc")} font-mono`} />
                      </label>
                    </div>
                  </div>
                  <p className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-2.5 text-xs leading-relaxed text-cyan-100/80">
                    Mode démonstration : aucun débit réel. Carte de test <span className="font-mono">4242 4242 4242 4242</span>, date future, n&apos;importe quel cryptogramme.
                    Ajoutez <span className="font-mono">STRIPE_SECRET_KEY</span> pour activer les vrais paiements.
                  </p>
                </>
              )}

              <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm text-zinc-400">
                <input type="checkbox" checked={form.accept} onChange={(e) => set("accept", e.target.checked)} className="mt-0.5 h-4 w-4 accent-violet-500" />
                <span>
                  J&apos;accepte les <Link href="/conditions" className="text-violet-300 underline-offset-2 hover:underline">conditions d&apos;utilisation</Link> et je m&apos;engage à utiliser Alter dans le respect des règles de chaque plateforme.
                </span>
              </label>

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error.message}{" "}
                    {error.field === "email" && error.message.includes("Connectez-vous") && (
                      <Link href="/connexion" className="font-semibold underline">Se connecter</Link>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" disabled={paymentUnavailable} className="btn-primary mt-7 w-full text-base disabled:cursor-not-allowed disabled:opacity-50">
                <Lock className="h-4 w-4" /> {stripeEnabled ? `Continuer vers le paiement · ${price.ttc}` : `Payer ${price.ttc} et activer mon numéro`}
              </button>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5" /> Paiement chiffré · Aucune donnée bancaire stockée
              </p>
            </motion.form>
          )}

          {phase === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="glass flex min-h-[520px] flex-col items-center justify-center rounded-3xl p-10">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <span className="animate-pulse-ring absolute inset-0 rounded-full bg-violet-500/30" />
                <span className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-violet-400/40" />
                <Smartphone className="h-10 w-10 text-white" />
              </div>
              <h2 className="mt-8 text-2xl font-semibold text-white">Activation de votre numéro…</h2>
              <ul className="mt-8 w-full max-w-sm space-y-3">
                {PROCESS_STEPS.map((s, i) => {
                  const done = step > i;
                  const current = step === i;
                  return (
                    <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: done || current ? 1 : 0.35, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 text-sm">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${done ? "bg-emerald-400/20 text-emerald-300" : "bg-white/5 text-zinc-400"}`}>
                        {done ? <Check className="h-3.5 w-3.5" /> : current ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />}
                      </span>
                      <span className={done ? "text-zinc-200" : "text-zinc-400"}>{s}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-3xl p-10 text-center">
              {Array.from({ length: 26 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/3 h-2 w-2 rounded-sm"
                  style={{ background: ["#a78bfa", "#f0abfc", "#67e8f9", "#86efac", "#fde047"][i % 5] }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: Math.cos((i / 26) * Math.PI * 2) * (140 + (i % 4) * 40), y: Math.sin((i / 26) * Math.PI * 2) * (110 + (i % 3) * 40) + 80, opacity: 0, rotate: 360 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                />
              ))}
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_60px_-10px_rgba(52,211,153,0.9)]">
                <Check className="h-10 w-10 text-white" strokeWidth={3} />
              </motion.div>
              <h2 className="mt-8 flex items-center gap-2 text-3xl font-semibold text-white">
                Votre numéro est prêt <PartyPopper className="h-7 w-7 text-fuchsia-300" />
              </h2>
              <p className="mt-3 text-zinc-400">Votre numéro dédié aux codes de vérification :</p>
              <motion.p initial={{ opacity: 0, y: 10, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.5, duration: 0.7 }} className="mt-3 font-mono text-3xl font-semibold tracking-wide text-gradient">
                {number}
              </motion.p>
              <p className="mt-6 max-w-sm text-sm text-zinc-500">Votre clé d&apos;accès personnelle s&apos;affichera dans votre espace. Conservez-la précieusement.</p>
              <a href="/espace" className="btn-primary mt-8 text-base">
                Accéder à mon espace <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border-spin rounded-3xl">
          <div className="rounded-3xl bg-ink-2/95 p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-12 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-b from-violet-600/50 to-fuchsia-600/30">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">{OFFER.name}</p>
                <p className="text-sm text-zinc-400">Numéro de vérification · {OFFER.durationLabel}</p>
              </div>
              <p className="ml-auto text-xl font-semibold text-white">{price.ttc}</p>
            </div>
            <ul className="mt-6 space-y-3 border-t border-white/[0.06] pt-6 text-sm text-zinc-300">
              {["Numéro français dédié aux codes", "SMS reçus en temps réel dans votre espace", "Guides pas à pas pour chaque application", "Sans reconduction automatique"].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-300" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-white/[0.06] pt-6 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Sous-total HT</span>
                <span>{price.ht}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>TVA (20 %)</span>
                <span>{price.tva}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-semibold text-white">
                <span>Total · {OFFER.durationLabel}</span>
                <span>{price.ttc}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-400">
          {[
            { icon: Zap, t: "Activation instantanée" },
            { icon: Sparkles, t: "Sans engagement" },
            { icon: ShieldCheck, t: "Paiement sécurisé" },
          ].map(({ icon: Icon, t }) => (
            <div key={t} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <Icon className="mx-auto h-4 w-4 text-violet-300" />
              <p className="mt-1.5">{t}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
