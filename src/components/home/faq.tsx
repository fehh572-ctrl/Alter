"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal, SectionHeading } from "@/components/ui";
import { OFFER } from "@/lib/offer";

export const FAQ_ITEMS = [
  {
    q: "Qu'est-ce qu'Alter, concrètement ?",
    a: "Un numéro de téléphone français qui ne sert qu'à une chose : recevoir vos codes de vérification par SMS. Les messages s'affichent dans votre espace membre, accessible depuis n'importe quel appareil. Pas de carte SIM, pas de matériel.",
  },
  {
    q: "Le numéro peut-il recevoir des appels ou envoyer des SMS ?",
    a: "Non. Le numéro Alter est volontairement limité à la réception des SMS de vérification (inscription, double authentification). C'est ce qui permet un prix bas et une boîte de réception toujours lisible.",
  },
  {
    q: "Est-ce que ça marche avec toutes les applications ?",
    a: "Avec la grande majorité, mais pas toutes : certaines plateformes (WhatsApp, Telegram, Signal, parfois des banques) refusent les numéros virtuels. Chaque guide indique ce que nous savons de l'application. Si un SMS n'arrive pas, contactez le support.",
  },
  {
    q: "À quoi servent les guides ?",
    a: "Chaque guide, personnalisé avec votre numéro, explique où le saisir, quels réglages activer (double authentification, confidentialité), et ce que la plateforme autorise : par exemple, Vinted accepte un compte particulier et un compte Pro par personne, Instagram et TikTok gèrent plusieurs comptes dans la même app.",
  },
  {
    q: "Est-ce légal ?",
    a: "Oui : avoir un second numéro est légal, et la plupart des plateformes autorisent plusieurs comptes ou un compte pro distinct. Vous devez respecter les conditions de chaque service. Alter ne doit jamais servir à contourner un bannissement, à frauder ou à usurper une identité : les numéros utilisés ainsi sont suspendus.",
  },
  {
    q: "Combien ça coûte, et qu'est-ce qui se passe au bout d'un an ?",
    a: `${OFFER.priceShort} pour ${OFFER.durationLabel}, payés une fois. Il n'y a pas de reconduction automatique : avant l'échéance, nous vous proposons de renouveler. Sans renouvellement, le numéro cesse de recevoir des SMS. Pensez à retirer ce numéro de vos comptes avant, ou à le remplacer.`,
  },
  {
    q: "Mes SMS sont-ils privés ?",
    a: "Vos messages ne sont visibles que dans votre espace, protégé par votre clé d'accès personnelle. Ne communiquez jamais un code de vérification à quelqu'un d'autre : aucun service légitime ne vous le demandera.",
  },
  {
    q: "J'ai perdu ma clé d'accès, que faire ?",
    a: "Si vous êtes encore connecté, générez une nouvelle clé depuis votre espace (rubrique Compte). Sinon, contactez le support depuis l'adresse e-mail utilisée lors de la commande.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative scroll-mt-24 py-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow="FAQ" title="Vos questions, nos réponses" subtitle="Tout ce qu'il faut savoir avant de commander." />
        <div className="mt-14 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.04} y={16}>
                <div className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? "border-violet-400/30 bg-violet-500/[0.06]" : "border-white/[0.08] bg-white/[0.02]"}`}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-white">{item.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10">
                      <Plus className="h-4 w-4 text-violet-200" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-zinc-400">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
