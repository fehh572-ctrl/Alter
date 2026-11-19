"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  Rocket,
  Smartphone,
  Sparkles,
  X as XIcon,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { AppCard } from "@/components/app-card";
import { AppIcon, REASON_ICONS } from "@/components/app-icon";
import { GlowCard, Reveal, SectionHeading } from "@/components/ui";
import { APPS, CATEGORIES, DUAL_REASONS, type AppCategory } from "@/lib/apps";
import { OFFER } from "@/lib/offer";

/* ------------------------------ Marquee ------------------------------ */
export function AppsMarquee() {
  const half = Math.ceil(APPS.length / 2);
  const rows = [APPS.slice(0, half), APPS.slice(half)];
  return (
    <section className="relative border-y border-white/[0.06] bg-white/[0.015] py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Un guide pour chacune de ces applications</p>
      <div className="mt-8 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="flex overflow-hidden">
            <div className={`flex shrink-0 gap-4 pr-4 ${r === 0 ? "animate-marquee" : "animate-marquee-reverse"}`}>
              {[...row, ...row, ...row, ...row].map((app, i) => (
                <Link
                  key={`${app.slug}-${i}`}
                  href={`/applications/${app.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] py-2 pl-2 pr-5 transition-colors hover:border-white/20"
                >
                  <AppIcon app={app} size="sm" />
                  <span className="whitespace-nowrap text-sm font-medium text-zinc-200">{app.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Steps ------------------------------ */
export function StepsSection() {
  const steps = [
    { icon: Smartphone, title: "Activez votre numéro", text: `${OFFER.priceShort} pour ${OFFER.durationLabel}. Votre numéro français est attribué tout de suite, sans carte SIM.` },
    { icon: Zap, title: "Saisissez-le dans vos apps", text: "À l'inscription ou dans les réglages de double authentification, à la place de votre numéro perso." },
    { icon: Download, title: "Récupérez vos codes", text: "Les SMS arrivent dans votre espace, sur ordinateur comme sur mobile. Le code est mis en évidence, prêt à copier." },
  ];
  return (
    <section id="fonctionnement" className="relative scroll-mt-24 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Fonctionnement"
          title={
            <>
              Trois étapes, <span className="text-gradient">aucun matériel</span>
            </>
          }
          subtitle="Pas de deuxième téléphone, pas de deuxième forfait. Tout se passe en ligne."
        />
        <div className="relative mt-20 grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute left-[16%] right-[16%] top-10 hidden h-px origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 md:block"
          />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={0.15 * i} className="relative text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <span className="animate-pulse-ring absolute inset-0 rounded-3xl bg-violet-500/20" style={{ animationDelay: `${i * 0.6}s` }} />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/40 to-fuchsia-600/20 shadow-[0_0_40px_-10px_rgba(168,85,247,0.8)]">
                  <s.icon className="h-8 w-8 text-white" />
                </span>
              </div>
              <p className="mt-6 font-mono text-xs text-violet-300">ÉTAPE 0{i + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Reasons ------------------------------ */
export function ReasonsSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Pourquoi un second numéro ?"
          title={
            <>
              Votre numéro perso n&apos;a pas à être <span className="text-gradient">partout</span>
            </>
          }
          subtitle="Revendeurs, créateurs, freelances, e-commerçants : un numéro dédié pour tout ce qui n'est pas votre vie privée."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DUAL_REASONS.map((r, i) => {
            const Icon = REASON_ICONS[r.icon];
            const big = i === 0 || i === 3;
            return (
              <Reveal key={r.title} delay={(i % 4) * 0.08} className={big ? "lg:col-span-2" : ""}>
                <GlowCard className="h-full p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/30 to-cyan-500/10">
                    <Icon className="h-6 w-6 text-violet-100" />
                  </div>
                  <h3 className={`mt-6 font-semibold text-white ${big ? "text-2xl" : "text-lg"}`}>{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{r.text}</p>
                  {big && (
                    <div className="mt-6 flex -space-x-2">
                      {APPS.filter((a) => (i === 0 ? a.tags.some((t) => t.includes("Monétisation")) : a.tags.some((t) => /Vie privée|Anonymat|Confidentialité/.test(t))))
                        .slice(0, 5)
                        .map((a) => (
                          <AppIcon key={a.slug} app={a} size="sm" className="ring-2 ring-ink" />
                        ))}
                    </div>
                  )}
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Showcase ------------------------------ */
export function AppsShowcase() {
  const [cat, setCat] = useState<AppCategory | "Populaires">("Populaires");
  const list = (cat === "Populaires" ? APPS.filter((a) => a.popular) : APPS.filter((a) => a.category === cat)).slice(0, 6);
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Bibliothèque"
          title={
            <>
              {APPS.length} applications, <span className="text-gradient">un guide pour chacune</span>
            </>
          }
          subtitle="Où saisir votre numéro, quels réglages activer, ce que la plateforme autorise : chaque guide est personnalisé avec votre numéro, sur Android comme sur iPhone."
        />
        <Reveal className="mt-12 flex flex-wrap justify-center gap-2">
          {(["Populaires", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${cat === c ? "text-white" : "text-zinc-400 hover:text-white"}`}
            >
              {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full border border-violet-400/40 bg-violet-500/15" />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {list.map((app, i) => (
              <motion.div
                key={app.slug}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, delay: Math.min(i, 5) * 0.05, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
              >
                <AppCard app={app} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <Reveal className="mt-12 text-center">
          <Link href="/applications" className="btn-ghost">
            Voir les {APPS.length} applications <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Comparison ------------------------------ */
export function ComparisonSection() {
  const rows: { label: string; alter: string | boolean; phone: string | boolean; sim: string | boolean }[] = [
    { label: "Prix", alter: `${OFFER.monthlyEquivalent} / mois (payé à l'année)`, phone: "150 € et plus + forfait", sim: "2 à 10 € / mois" },
    { label: "Reçoit les SMS de vérification", alter: true, phone: true, sim: true },
    { label: "Appels et envoi de SMS", alter: false, phone: true, sim: true },
    { label: "Guides par application", alter: true, phone: false, sim: false },
    { label: "Activation", alter: "Instantanée", phone: "Livraison", sim: "Envoi de la SIM" },
    { label: "Accessible depuis tout appareil", alter: true, phone: false, sim: false },
    { label: "Rien à transporter", alter: true, phone: false, sim: false },
  ];
  const cell = (v: string | boolean, highlight = false) =>
    typeof v === "boolean" ? (
      v ? (
        <Check className={`mx-auto h-5 w-5 ${highlight ? "text-emerald-300" : "text-zinc-400"}`} />
      ) : (
        <XIcon className="mx-auto h-5 w-5 text-zinc-600" />
      )
    ) : (
      <span className={highlight ? "font-semibold text-white" : "text-zinc-400"}>{v}</span>
    );
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="Comparatif" title="Un second numéro, sans second téléphone" subtitle="Alter ne remplace pas une ligne : il fait une seule chose, recevoir vos codes, et la fait simplement." />
        <Reveal className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="p-4 text-left font-medium text-zinc-500" />
                <th className="rounded-t-2xl border-x border-t border-violet-400/30 bg-violet-500/10 p-4 font-semibold text-white">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-fuchsia-300" /> Alter
                  </span>
                </th>
                <th className="p-4 font-medium text-zinc-400">2ᵉ smartphone</th>
                <th className="p-4 font-medium text-zinc-400">2ᵉ forfait / SIM</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.label}>
                  <td className="border-t border-white/[0.06] p-4 text-zinc-300">{r.label}</td>
                  <td className={`border-x border-t border-violet-400/30 border-t-white/[0.06] bg-violet-500/10 p-4 text-center ${i === rows.length - 1 ? "rounded-b-2xl border-b" : ""}`}>
                    {cell(r.alter, true)}
                  </td>
                  <td className="border-t border-white/[0.06] p-4 text-center">{cell(r.phone)}</td>
                  <td className="border-t border-white/[0.06] p-4 text-center">{cell(r.sim)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Pricing ------------------------------ */
export function PricingSection() {
  const features = [
    "1 numéro français dédié aux codes de vérification",
    "Réception des SMS en temps réel, code mis en évidence",
    "Espace membre accessible depuis tous vos appareils",
    `Guides personnalisés pour ${APPS.length} applications`,
    "Nouveaux guides ajoutés sans surcoût",
    "Sans reconduction automatique : vous décidez de renouveler",
  ];
  return (
    <section id="tarif" className="relative scroll-mt-24 py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/15 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Tarif" title="Un prix clair. Pas de surprise." subtitle="Payé une fois pour l'année, sans reconduction automatique ni frais cachés." />
        <Reveal className="mx-auto mt-14 max-w-4xl">
          <div className="border-spin rounded-[2rem]">
            <div className="grid overflow-hidden rounded-[2rem] bg-ink-2/95 md:grid-cols-[1fr_1.1fr]">
              <div className="relative flex flex-col justify-between overflow-hidden border-b border-white/[0.06] p-10 md:border-b-0 md:border-r">
                <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet-600/30 blur-3xl" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-white">
                    <Rocket className="h-3.5 w-3.5" /> Pass annuel
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold text-white">{OFFER.name}</h3>
                  <p className="mt-2 text-sm text-zinc-400">Votre numéro de vérification pendant {OFFER.durationLabel}, guides inclus.</p>
                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-7xl font-semibold tracking-tight text-white">{OFFER.priceCents / 100}</span>
                    <span className="mb-3 text-3xl font-semibold text-white">€</span>
                    <span className="mb-4 ml-1 text-sm text-zinc-400">TTC · {OFFER.durationLabel}</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">Soit {OFFER.monthlyEquivalent} par mois.</p>
                </div>
                <div className="relative mt-10">
                  <Link href="/commander" className="btn-primary w-full text-base">
                    Obtenir mon numéro <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-3 text-center text-xs text-zinc-500">Activation instantanée après paiement</p>
                </div>
              </div>
              <ul className="space-y-4 p-10">
                {features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex items-start gap-3 text-sm text-zinc-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Final CTA ------------------------------ */
export function FinalCta() {
  return (
    <section className="px-6 py-16">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 p-12 text-center sm:p-20">
        <div className="animate-gradient absolute inset-0 bg-[linear-gradient(120deg,#4c1d95,#86198f,#155e75,#4c1d95)] bg-[length:300%_300%] opacity-80" />
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Votre numéro perso mérite des vacances.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">Activé en moins d&apos;une minute. {OFFER.priceShort} pour {OFFER.durationLabel}, sans reconduction automatique.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/commander" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-zinc-900 shadow-2xl transition-transform hover:-translate-y-0.5">
              Obtenir mon numéro <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/guide" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 font-semibold text-white transition-colors hover:bg-white/10">
              Lire le guide
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
