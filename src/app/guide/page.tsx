import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleQuestionMark, Copy, KeyRound, MonitorSmartphone, ShieldCheck, Smartphone } from "lucide-react";
import { Reveal } from "@/components/ui";
import { ANDROID_BRANDS } from "@/lib/guide";

export const metadata: Metadata = {
  title: "Guide : utiliser votre numéro Alter",
  description: "Où saisir votre numéro Alter, comment récupérer vos codes, et comment gérer un compte pro à côté de votre compte perso sur Android et iPhone.",
};

const TROUBLE = [
  { q: "Le code n'arrive pas", a: "Vérifiez le numéro saisi (format +33 6 39 98…), attendez 60 secondes puis redemandez un code. Certaines applications limitent le nombre de demandes par heure." },
  { q: "L'application refuse le numéro", a: "Quelques services n'acceptent pas les numéros virtuels pour certaines fonctions. Utilisez alors la méthode e-mail si elle est proposée, ou contactez le support." },
  { q: "Je ne trouve pas le clonage sur mon Android", a: "Tous les fabricants ne le proposent pas (Google Pixel notamment). Installez l'application open source « Shelter » pour créer un profil isolé." },
  { q: "La plateforme bloque mon second compte", a: "Certaines plateformes limitent le nombre de comptes par personne (Vinted : un compte particulier et un compte Pro). Respectez ces règles : un numéro différent ne change rien aux conditions d'utilisation." },
];

export default function GuidePage() {
  return (
    <div className="relative overflow-hidden pt-36">
      <div className="bg-grid absolute inset-x-0 top-0 h-[600px]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-fuchsia-600/15 blur-[120px]" />
      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">Guide</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Utiliser votre numéro, <span className="text-gradient">étape par étape</span>
          </h1>
          <p className="mt-5 text-lg text-zinc-400">De la saisie du numéro à la validation du compte : comptez environ 3 minutes.</p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-4">
          {[
            { icon: Copy, t: "Copier", d: "Votre numéro depuis votre espace" },
            { icon: Smartphone, t: "Saisir", d: "Dans l'application, à la place de votre numéro perso" },
            { icon: KeyRound, t: "Valider", d: "Avec le code reçu dans votre espace" },
            { icon: ShieldCheck, t: "Sécuriser", d: "Double authentification et confidentialité" },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 0.07}>
              <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="font-mono text-xs text-violet-300">0{i + 1}</p>
                <s.icon className="mt-4 h-6 w-6 text-white" />
                <p className="mt-4 font-semibold text-white">{s.t}</p>
                <p className="mt-1 text-sm text-zinc-400">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <section className="mt-24">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Un compte pro à côté de votre compte perso</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              Si la plateforme l&apos;autorise (compte Pro, compte Business, multi-comptes intégré), voici comment utiliser les deux sur le même téléphone.
              Vérifiez toujours les règles de la plateforme dans le guide de l&apos;application.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Smartphone className="h-5 w-5 text-emerald-300" /> Android : fonction native du fabricant
                </h3>
                <ul className="mt-5 divide-y divide-white/[0.06] text-sm">
                  {ANDROID_BRANDS.map((b) => (
                    <li key={b.brand} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
                      <span className="font-medium text-zinc-200">{b.brand}</span>
                      <span className="text-zinc-400">{b.path}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <MonitorSmartphone className="h-5 w-5 text-cyan-300" /> iPhone : trois méthodes
                </h3>
                <ol className="mt-5 space-y-4 text-sm text-zinc-400">
                  <li><span className="font-semibold text-zinc-200">1. Multi-comptes intégré.</span> Instagram, TikTok, Telegram, Discord, X, Gmail ou YouTube permettent d&apos;ajouter un compte directement dans l&apos;app.</li>
                  <li><span className="font-semibold text-zinc-200">2. Application « Business ».</span> WhatsApp Business ou PayPal Business s&apos;installent à côté de l&apos;app classique.</li>
                  <li><span className="font-semibold text-zinc-200">3. Version web.</span> Ouvrez le site dans Safari, connectez le second compte puis Partager › « Sur l&apos;écran d&apos;accueil » : une icône dédiée apparaît.</li>
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mt-24">
          <Reveal>
            <h2 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-white">
              <CircleQuestionMark className="h-7 w-7 text-violet-300" /> Dépannage
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TROUBLE.map((t, i) => (
              <Reveal key={t.q} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
                  <p className="font-semibold text-white">{t.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{t.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="mt-20 text-center">
          <Link href="/applications" className="btn-primary">
            Choisir une application <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
