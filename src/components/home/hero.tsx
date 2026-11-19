"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, CreditCard, Lock, Sparkles, Timer, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { AppIcon } from "@/components/app-icon";
import { PhoneFrame, useClock } from "@/components/phone-frame";
import { APPS, getApp } from "@/lib/apps";
import { OFFER } from "@/lib/offer";

const FEED = [
  { slug: "vinted", code: "482 913" },
  { slug: "tiktok", code: "739 204" },
  { slug: "instagram", code: "551 873" },
  { slug: "stripe", code: "214 678" },
  { slug: "whatsapp", code: "306-118" },
  { slug: "snapchat", code: "927-450" },
  { slug: "youtube", code: "G-648 201" },
  { slug: "telegram", code: "54 321" },
];

function HeroPhoneScreen() {
  const now = useClock();
  const [tick, setTick] = useState(3);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);
  const items = Array.from({ length: 4 }, (_, i) => tick - i).filter((n) => n >= 0);

  return (
    <div className="flex h-full flex-col px-3">
      <div className="mt-6 text-center">
        <p className="text-xs font-medium text-white/70" suppressHydrationWarning>
          {now ? now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "mardi 12 mai"}
        </p>
        <p className="text-6xl font-semibold tracking-tight text-white" suppressHydrationWarning>
          {now ? now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "09:41"}
        </p>
        <p className="mt-1 font-mono text-[10px] tracking-widest text-violet-200/80">ALTER ONE · +33 6 39 98 •• ••</p>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((n) => {
            const f = FEED[n % FEED.length];
            const app = getApp(f.slug) ?? APPS[0];
            return (
              <motion.div
                key={n}
                layout
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="rounded-2xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2">
                  <AppIcon app={app} size="xs" />
                  <span className="text-[11px] font-semibold text-white">{app.sms.sender}</span>
                  <span className="ml-auto text-[10px] text-white/50">{n === tick ? "maintenant" : `il y a ${(tick - n) * 3} s`}</span>
                </div>
                <p className="mt-1.5 text-[11px] leading-snug text-white/80">
                  Votre code de vérification : <span className="font-mono font-bold text-white">{f.code}</span>
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const phoneY = useTransform(scrollY, [0, 600], [0, 90]);
  const phoneRotate = useTransform(scrollY, [0, 600], [-4, 4]);
  const glowOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
      <div className="bg-grid absolute inset-0" />
      <motion.div style={{ opacity: glowOpacity }} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="animate-blob absolute right-[-10%] top-40 h-[380px] w-[380px] rounded-full bg-fuchsia-500/20 blur-[100px]" />
        <div className="animate-blob absolute left-[-8%] top-80 h-[320px] w-[320px] rounded-full bg-cyan-500/15 blur-[100px] [animation-delay:-6s]" />
      </motion.div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href="/applications"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-xs text-zinc-300 transition-colors hover:border-violet-400/40"
            >
              <span className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 font-semibold text-white">Guides</span>
              Pas à pas pour {APPS.length} applications
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Gardez votre numéro
            <br />
            <span className="text-gradient">pour vos proches.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
          >
            Un numéro français dédié aux <strong className="font-semibold text-zinc-200">codes de vérification</strong> de vos comptes pro et en ligne
            (Vinted Pro, Instagram, Stripe, Leboncoin…). Les SMS arrivent dans votre espace, accessible partout.{" "}
            <strong className="font-semibold text-zinc-200">Votre ligne perso ne circule plus.</strong>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/commander" className="btn-primary text-base">
              Obtenir mon numéro · {OFFER.priceShort} / an <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/applications" className="btn-ghost text-base">
              <Sparkles className="h-4 w-4 text-fuchsia-300" /> Voir les cas d&apos;usage
            </Link>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } } }}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400"
          >
            {[
              { icon: Zap, text: "Activation instantanée" },
              { icon: CreditCard, text: "Sans reconduction automatique" },
              { icon: Lock, text: "Sans carte SIM" },
            ].map(({ icon: Icon, text }) => (
              <motion.li key={text} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-violet-300" /> {text}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div style={{ y: phoneY, rotate: phoneRotate }} className="relative">
            <div className="animate-float">
              <PhoneFrame>
                <HeroPhoneScreen />
              </PhoneFrame>
            </div>

            <div className="animate-float-slow glass absolute -left-4 top-24 hidden rounded-2xl px-4 py-3 shadow-2xl sm:block lg:-left-16">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Numéro actif
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-white">+33 6 39 98 •• ••</p>
            </div>

            <div className="animate-float glass absolute -right-2 top-1/2 hidden rounded-2xl px-4 py-3 shadow-2xl [animation-delay:-3s] sm:block lg:-right-10">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Timer className="h-4 w-4 text-cyan-300" /> Code reçu, numéro perso jamais affiché
              </p>
            </div>

            <div className="animate-float-slow glass absolute -left-2 bottom-16 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl sm:flex lg:-left-12">
              <AppIcon app={getApp("instagram") ?? APPS[0]} size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">Instagram · compte pro</p>
                <p className="flex items-center gap-1 text-xs text-emerald-300">
                  <BadgeCheck className="h-3.5 w-3.5" /> Vérifié avec Alter
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
