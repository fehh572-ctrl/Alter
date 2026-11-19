import type { Metadata } from "next";
import { OFFER } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Conditions d'utilisation & usage responsable",
  description: "Conditions d'utilisation du service Alter et règles d'usage responsable.",
};

const SECTIONS = [
  {
    title: "1. Le service",
    body: "Alter fournit un numéro de téléphone dédié exclusivement à la réception de SMS de vérification, consultable depuis un espace membre en ligne, ainsi que des guides expliquant comment l'utiliser avec des applications tierces dans le respect de leurs règles (compte pro, multi-comptes intégré, versions web). La compatibilité avec chaque application n'est pas garantie : certaines plateformes refusent les numéros virtuels.",
  },
  {
    title: "2. Prix et paiement",
    body: `L'offre ${OFFER.name} est facturée ${OFFER.priceShort} TTC pour une durée de ${OFFER.durationLabel}, en un seul paiement et sans reconduction automatique. À l'échéance, le numéro cesse de recevoir des SMS sauf renouvellement ; il peut ensuite être réattribué après un délai de sécurité. L'accès est activé immédiatement après confirmation du paiement. [À faire valider par un juriste : conditions d'exercice du droit de rétractation pour un service activé immédiatement.]`,
  },
  {
    title: "3. Usage responsable",
    body: "Vous vous engagez à respecter les conditions d'utilisation de chaque plateforme tierce. Il est strictement interdit d'utiliser Alter pour contourner une sanction légitime, commettre une fraude (paiement, promotion, identité), usurper l'identité d'un tiers, harceler, envoyer du spam ou exercer toute activité illégale. Les comptes financiers (Stripe, PayPal…) doivent correspondre à une activité réelle ouverte à votre nom.",
  },
  {
    title: "4. Numéro et messages",
    body: "Le numéro ne permet ni appels ni envoi de SMS. Les messages reçus sont accessibles uniquement depuis votre espace, protégé par votre clé d'accès. Ne communiquez jamais un code de vérification à un tiers. Alter peut suspendre un numéro en cas d'usage abusif.",
  },
  {
    title: "5. Marques",
    body: "Les noms d'applications cités (Vinted, TikTok, Instagram, Stripe, etc.) sont des marques de leurs propriétaires respectifs. Alter n'est affilié à aucune de ces sociétés et ne distribue aucune application, modifiée ou non.",
  },
  {
    title: "6. Données personnelles",
    body: "Nous collectons uniquement les données nécessaires au service (nom, e-mail, messages reçus). Aucune donnée bancaire n'est stockée par Alter. Vous pouvez demander la suppression de votre compte à tout moment depuis l'adresse e-mail utilisée lors de la commande.",
  },
];

export default function ConditionsPage() {
  return (
    <div className="relative pt-36">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Mis à jour le {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Conditions d&apos;utilisation & usage responsable</h1>
        <div className="mt-12 space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.title} className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7">
              <h2 className="text-lg font-semibold text-white">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
