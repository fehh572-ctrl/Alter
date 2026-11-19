"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/app-icon";

const LINKS = [
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/applications", label: "Applications" },
  { href: "/#tarif", label: "Tarif" },
  { href: "/guide", label: "Guide" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
          scrolled || open ? "glass shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]" : "border border-transparent"
        }`}
      >
        <Link href="/" aria-label="Accueil Alter">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = l.href === pathname || (l.href !== "/" && !l.href.startsWith("/#") && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${active ? "text-white" : "text-zinc-400 hover:text-white"}`}
              >
                {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/[0.08]" />}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/connexion" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white">
            Mon espace
          </Link>
          <Link href="/commander" className="btn-primary !px-4 !py-2 text-sm">
            Obtenir mon Alter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-zinc-200 hover:bg-white/5">
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/connexion" onClick={() => setOpen(false)} className="btn-ghost !py-3 text-sm">
                Mon espace
              </Link>
              <Link href="/commander" onClick={() => setOpen(false)} className="btn-primary !py-3 text-sm">
                Commander
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
