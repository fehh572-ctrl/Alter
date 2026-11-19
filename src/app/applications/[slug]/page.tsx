import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Download, FileArchive, Info, Lightbulb, MonitorSmartphone, Smartphone } from "lucide-react";
import { AppCard } from "@/components/app-card";
import { AppIcon } from "@/components/app-icon";
import { Reveal } from "@/components/ui";
import { APPS, getApp } from "@/lib/apps";
import { OFFER } from "@/lib/offer";
import { ANDROID_BRANDS, buildSteps } from "@/lib/guide";

export function generateStaticParams() {
  return APPS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return { title: "Application introuvable" };
  return {
    title: `${app.name} : utiliser un numéro dédié pour vos codes de vérification`,
    description: `${app.tagline} ${app.description.slice(0, 120)}…`,
  };
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();

  const steps = buildSteps(app, "votre numéro Alter");
  const related = [...APPS.filter((a) => a.category === app.category && a.slug !== app.slug), ...APPS.filter((a) => a.category !== app.category && a.popular)]
    .filter((a) => a.slug !== app.slug)
    .slice(0, 3);
  const sample = app.sms.template.replace("{code}", app.sms.format === "dash" ? "482-913" : app.sms.format === "space" ? "482 913" : "482913".slice(0, app.sms.digits));

  return (
    <div className="relative overflow-hidden pt-32">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-[130px]" style={{ background: `linear-gradient(90deg, ${app.color[0]}, ${app.color[1]})` }} />
      <div className="bg-grid absolute inset-x-0 top-0 h-[600px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Link href="/applications" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Toutes les applications
        </Link>

        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="flex items-center gap-4">
              <AppIcon app={app} size="xl" />
              <div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-zinc-400">{app.category}</span>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {app.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {app.name} <span className="text-gradient">sans votre numéro perso</span>
            </h1>
            <p className="mt-4 text-xl text-zinc-300">{app.tagline}</p>
            <p className="mt-5 max-w-2xl leading-relaxed text-zinc-400">{app.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`/api/download/${app.slug}`} target="_blank" rel="noopener" className="btn-primary">
                <Download className="h-4 w-4" /> Ouvrir mon guide {app.name}
              </a>
              <Link href="/commander" className="btn-ghost">
                Pas encore de numéro ? {OFFER.priceShort} / an <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
              <span className="flex items-center gap-2"><FileArchive className="h-4 w-4" /> Guide personnalisé</span>
              <span className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Android & iPhone</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4" /> {app.nativeMulti ? "Multi-comptes intégré" : "Fonction Android / version web"}</span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative mx-auto max-w-sm">
              <div className="glass animate-float rounded-3xl p-5 shadow-2xl">
                <div className="flex items-center gap-3">
                  <AppIcon app={app} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-white">{app.sms.sender}</p>
                    <p className="text-xs text-zinc-500">SMS reçu sur votre Alter · maintenant</p>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl bg-white/[0.06] p-4 text-sm leading-relaxed text-zinc-200">{sample}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-500">+33 6 39 98 •• ••</span>
                  <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 font-medium text-emerald-300">Code détecté</span>
                </div>
              </div>
              <div className="glass animate-float-slow absolute -bottom-8 -right-4 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-xl">
                Numéro perso non exposé ✓
              </div>
            </div>
          </Reveal>
        </div>

        <section className="mt-28">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Pourquoi un numéro dédié pour {app.name} ?</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {app.benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.07}>
                <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-bold text-white" style={{ background: `linear-gradient(140deg, ${app.color[0]}, ${app.color[1]})` }}>
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-28 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Pas à pas</h2>
              <p className="mt-3 text-zinc-400">Depuis votre espace, ce guide s&apos;ouvre personnalisé avec votre numéro Alter.</p>
            </Reveal>
            <ol className="relative mt-10 space-y-8 border-l border-white/10 pl-8">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06}>
                  <li className="relative">
                    <span className="absolute -left-[49px] flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/40 bg-ink font-mono text-xs font-bold text-violet-200">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold text-white">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{s.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="space-y-6">
            <Reveal>
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Smartphone className="h-5 w-5 text-emerald-300" /> Clonage natif Android
                </h3>
                <ul className="mt-4 divide-y divide-white/[0.06] text-sm">
                  {ANDROID_BRANDS.map((b) => (
                    <li key={b.brand} className="py-2.5">
                      <p className="font-medium text-zinc-200">{b.brand}</p>
                      <p className="text-zinc-500">{b.path}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <MonitorSmartphone className="h-5 w-5 text-cyan-300" /> Sur iPhone
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{app.iosMethod}</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mt-20 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="h-full rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-7">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <Lightbulb className="h-5 w-5 text-amber-300" /> Conseils pour {app.name}
              </h3>
              <ul className="mt-4 space-y-3">
                {app.tips.map((t) => (
                  <li key={t} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <Info className="h-5 w-5 text-violet-300" /> Usage responsable
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Respectez les conditions d&apos;utilisation de {app.name}. Alter ne doit pas servir à contourner une sanction légitime, à frauder ou à usurper l&apos;identité d&apos;un tiers. Ne communiquez jamais un code reçu.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mt-28">
          <Reveal>
            <h2 className="text-2xl font-semibold text-white">Autres guides</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.07}>
                <AppCard app={a} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
