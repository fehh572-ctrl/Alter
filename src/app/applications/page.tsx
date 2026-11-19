import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileArchive, ShieldCheck, Smartphone } from "lucide-react";
import { Catalog } from "@/components/catalog";
import { Reveal } from "@/components/ui";
import { APPS } from "@/lib/apps";
import { OFFER } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Guides par application",
  description: `${APPS.length} guides (Vinted, TikTok, Instagram, Stripe, Leboncoin…) pour utiliser un numéro dédié à vos codes de vérification, compte pro ou compte perso.`,
};

export default function ApplicationsPage() {
  return (
    <div className="relative overflow-hidden pt-36">
      <div className="bg-grid absolute inset-x-0 top-0 h-[600px]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
            Bibliothèque · {APPS.length} guides
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Un guide pour <span className="text-gradient">chaque application</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            Chaque guide est personnalisé avec votre numéro : où le saisir, quels réglages activer, ce que la plateforme autorise (compte Pro, multi-comptes intégré…) et que faire si le SMS n&apos;arrive pas.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { icon: FileArchive, title: "Guide personnalisé", text: "S'ouvre dans votre navigateur, avec votre numéro déjà renseigné." },
            { icon: Smartphone, title: "Android & iPhone", text: "Clonage natif, multi-comptes ou version web." },
            { icon: ShieldCheck, title: "Sans APK modifié", text: "Uniquement des méthodes officielles et sûres." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-300" />
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-zinc-400">{text}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <div className="mt-14">
          <Catalog />
        </div>

        <Reveal className="mt-20 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/10 to-cyan-600/20 p-10 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-semibold text-white">Tous les guides sont inclus</h2>
            <p className="mt-2 text-zinc-300">{OFFER.priceShort} pour {OFFER.durationLabel} : votre numéro dédié et tous les guides, sans reconduction automatique.</p>
          </div>
          <Link href="/commander" className="btn-primary shrink-0">
            Obtenir mon numéro <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
