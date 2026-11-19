"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  Copy,
  Download,
  Inbox,
  KeyRound,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  TriangleExclamationPoint,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppIcon, Logo } from "@/components/app-icon";
import { PhoneFrame } from "@/components/phone-frame";
import { APPS, getApp } from "@/lib/apps";

export type DashMessage = { id: string; sender: string; body: string; code: string | null; appSlug: string | null; createdAt: string; readAt: string | null };

type Props = {
  customer: { name: string; email: string; createdAt: string };
  phone: { display: string; model: string; createdAt: string; expiresAt: string | null };
  demo: boolean;
  initialMessages: DashMessage[];
  downloaded: string[];
  welcomeKey: string | null;
};

function relTime(iso: string, now: number) {
  const diff = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (diff < 10) return "à l'instant";
  if (diff < 60) return `il y a ${diff} s`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  const d = new Date(iso);
  if (diff < 86400) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard indisponible */
    }
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
  }, []);
  return { copied, copy };
}

function KeyModal({ title, accessKey, onClose, intro }: { title: string; accessKey: string; onClose: () => void; intro: string }) {
  const { copied, copy } = useCopy();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="border-spin w-full max-w-md rounded-3xl">
        <div className="rounded-3xl bg-ink-2 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <KeyRound className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{intro}</p>
          <button type="button" onClick={() => copy(accessKey, "key")} className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-violet-400/30 bg-violet-500/10 px-5 py-4 font-mono text-lg tracking-wider text-white transition-colors hover:bg-violet-500/20">
            {accessKey}
            {copied === "key" ? <Check className="h-5 w-5 text-emerald-300" /> : <Copy className="h-5 w-5 text-violet-200" />}
          </button>
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-300/10 p-3 text-left text-xs leading-relaxed text-amber-100">
            <TriangleExclamationPoint className="mt-0.5 h-4 w-4 shrink-0" /> Cette clé ne sera plus affichée. Conservez-la (gestionnaire de mots de passe, capture d&apos;écran…) : elle vous permet de vous reconnecter.
          </p>
          <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
            J&apos;ai noté ma clé
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Dashboard({ customer, phone, demo, initialMessages, downloaded: initialDownloaded, welcomeKey }: Props) {
  const [messages, setMessages] = useState<DashMessage[]>(initialMessages);
  const [pending, setPending] = useState(0);
  const [tab, setTab] = useState<"messages" | "apps">("messages");
  const [toast, setToast] = useState<DashMessage | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState(APPS[0].slug);
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>(initialDownloaded);
  const [modalKey, setModalKey] = useState<{ key: string; welcome: boolean } | null>(welcomeKey ? { key: welcomeKey, welcome: true } : null);
  const [rotating, setRotating] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const known = useRef(new Set(initialMessages.map((m) => m.id)));
  const { copied, copy } = useCopy();
  const firstName = customer.name.split(" ")[0];

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/phone/messages", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { ok: boolean; messages: DashMessage[]; pending: number };
      if (!data.ok) return;
      const incoming = data.messages.filter((m) => !known.current.has(m.id));
      incoming.forEach((m) => known.current.add(m.id));
      setMessages(data.messages);
      setPending(data.pending);
      if (incoming.length > 0) {
        setToast(incoming[0]);
        setTab("messages");
        setFresh((prev) => new Set([...prev, ...incoming.map((m) => m.id)]));
        setTimeout(() => setToast((t) => (t?.id === incoming[0].id ? null : t)), 4200);
        setTimeout(() => setFresh((prev) => {
          const next = new Set(prev);
          incoming.forEach((m) => next.delete(m.id));
          return next;
        }), 8000);
        if (data.pending === 0) setRequesting(false);
        void fetch("/api/phone/messages", { method: "PATCH" });
      }
    } catch {
      /* réseau indisponible : on réessaie au prochain cycle */
    }
  }, []);

  useEffect(() => {
    const id = setInterval(poll, pending > 0 || requesting ? 1000 : 3500);
    return () => clearInterval(id);
  }, [poll, pending, requesting]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    void fetch("/api/phone/messages", { method: "PATCH" });
    return () => clearInterval(id);
  }, []);

  const requestCode = async () => {
    setRequesting(true);
    setRequestError(null);
    try {
      const res = await fetch("/api/phone/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appSlug: selected }) });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "Erreur");
      setPending((p) => p + 1);
    } catch (err) {
      setRequestError((err as Error).message);
      setRequesting(false);
    }
  };

  const rotateKey = async () => {
    if (!confirm("Générer une nouvelle clé d'accès ? L'ancienne ne fonctionnera plus.")) return;
    setRotating(true);
    const res = await fetch("/api/auth/rotate-key", { method: "POST" });
    const data = (await res.json()) as { ok: boolean; accessKey?: string };
    setRotating(false);
    if (data.ok && data.accessKey) setModalKey({ key: data.accessKey, welcome: false });
  };

  const closeModal = () => {
    if (modalKey?.welcome) void fetch("/api/auth/welcome", { method: "DELETE" });
    setModalKey(null);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const codesCount = useMemo(() => messages.filter((m) => m.code).length, [messages]);
  const selectedApp = getApp(selected) ?? APPS[0];
  const installed = APPS.filter((a) => downloaded.includes(a.slug));

  return (
    <div className="relative mx-auto max-w-6xl px-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {phone.model} actif
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{`Bonjour ${firstName}`}</h1>
          <p className="mt-2 text-zinc-400">Votre numéro est prêt à recevoir vos codes de vérification.</p>
        </motion.div>
        <button type="button" onClick={logout} className="btn-ghost self-start !py-2.5 text-sm md:self-auto">
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: "SMS reçus", value: messages.length, icon: Inbox },
          { label: "Codes détectés", value: codesCount, icon: ShieldCheck },
          { label: "Guides téléchargés", value: downloaded.length, icon: Download },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:p-5">
            <s.icon className="h-4 w-4 text-violet-300" />
            <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{s.value}</p>
            <p className="text-xs text-zinc-400 sm:text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* ---------- Téléphone virtuel ---------- */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:sticky lg:top-28 lg:self-start">
          <PhoneFrame>
            <div className="flex h-full flex-col">
              <AnimatePresence>
                {toast && (
                  <motion.div
                    key={toast.id}
                    initial={{ y: -80, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="absolute inset-x-2 top-1 z-40 rounded-2xl border border-white/15 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-2">
                      {getApp(toast.appSlug ?? "") ? <AppIcon app={getApp(toast.appSlug ?? "")!} size="xs" /> : <Bell className="h-4 w-4 text-violet-300" />}
                      <span className="text-[11px] font-semibold text-white">{toast.sender}</span>
                      <span className="ml-auto text-[10px] text-white/50">maintenant</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] text-white/80">{toast.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-4 pt-4">
                <p className="text-center font-mono text-[11px] tracking-wider text-violet-200/80">{phone.display}</p>
                <div className="mt-3 grid grid-cols-2 rounded-xl bg-white/[0.06] p-1 text-[11px] font-semibold">
                  {(["messages", "apps"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setTab(t)} className={`relative rounded-lg py-1.5 ${tab === t ? "text-white" : "text-white/50"}`}>
                      {tab === t && <motion.span layoutId="phone-tab" className="absolute inset-0 rounded-lg bg-white/10" />}
                      <span className="relative flex items-center justify-center gap-1.5">
                        {t === "messages" ? <MessageSquare className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
                        {t === "messages" ? "Messages" : "Apps"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:none]">
                {tab === "messages" ? (
                  <div className="flex flex-col gap-2">
                    <AnimatePresence initial={false}>
                      {pending > 0 && (
                        <motion.div key="pending" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-2xl border border-dashed border-violet-400/30 p-2.5 text-[11px] text-violet-200">
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> SMS en cours d&apos;acheminement…
                        </motion.div>
                      )}
                      {messages.map((m) => {
                        const app = getApp(m.appSlug ?? "");
                        const isFresh = fresh.has(m.id);
                        return (
                          <motion.div
                            key={m.id}
                            layout
                            initial={{ opacity: 0, y: -16, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`rounded-2xl border p-2.5 transition-colors ${isFresh ? "border-fuchsia-400/50 bg-fuchsia-500/15" : "border-white/10 bg-white/[0.07]"}`}
                          >
                            <div className="flex items-center gap-2">
                              {app ? <AppIcon app={app} size="xs" /> : <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500"><Sparkles className="h-3.5 w-3.5 text-white" /></span>}
                              <span className="text-[11px] font-semibold text-white">{m.sender}</span>
                              <span suppressHydrationWarning className="ml-auto text-[10px] text-white/45">{relTime(m.createdAt, now)}</span>
                            </div>
                            <p className="mt-1.5 text-[11px] leading-snug text-white/80">{m.body}</p>
                            {m.code && (
                              <button type="button" onClick={() => copy(m.code ?? "", m.id)} className="mt-2 flex w-full items-center justify-between rounded-xl bg-black/30 px-2.5 py-1.5 font-mono text-sm font-bold tracking-[0.2em] text-white">
                                {m.code}
                                <span className="flex items-center gap-1 font-sans text-[10px] font-medium tracking-normal text-violet-200">
                                  {copied === m.id ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  {copied === m.id ? "Copié" : "Copier"}
                                </span>
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-x-2 gap-y-4 pt-2">
                    {installed.map((a) => (
                      <Link key={a.slug} href={`/applications/${a.slug}`} className="flex flex-col items-center gap-1">
                        <AppIcon app={a} size="sm" />
                        <span className="w-full truncate text-center text-[9px] text-white/80">{a.name.split(" ")[0]} ²</span>
                      </Link>
                    ))}
                    <a href="#bibliotheque" className="flex flex-col items-center gap-1">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-white/25 text-white/60">
                        <Plus className="h-4 w-4" />
                      </span>
                      <span className="text-[9px] text-white/60">Ajouter</span>
                    </a>
                    {installed.length === 0 && <p className="col-span-4 mt-6 text-center text-[11px] text-white/45">Téléchargez un pack pour l&apos;ajouter ici.</p>}
                  </div>
                )}
              </div>
            </div>
          </PhoneFrame>

          <button type="button" onClick={() => copy(phone.display.replace(/\s/g, ""), "number")} className="mx-auto mt-6 flex w-full max-w-[300px] items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-colors hover:border-violet-400/40">
            <span>
              <span className="block text-[11px] uppercase tracking-wider text-zinc-500">Votre numéro Alter</span>
              <span className="font-mono text-base font-semibold text-white">{phone.display}</span>
            </span>
            {copied === "number" ? <Check className="h-5 w-5 text-emerald-300" /> : <Copy className="h-5 w-5 text-zinc-400" />}
          </button>
        </motion.div>

        {/* ---------- Colonne principale ---------- */}
        <div className="space-y-6">
          {!demo && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-white">Recevoir un code de vérification</h2>
              <ol className="mt-4 space-y-2 text-sm text-zinc-300">
                <li>1. Copiez votre numéro Alter (à gauche).</li>
                <li>2. Saisissez-le dans l&apos;application, à l&apos;inscription ou dans les réglages de double authentification.</li>
                <li>3. Le SMS apparaît ici en quelques secondes, avec le code mis en évidence.</li>
              </ol>
              <p className="mt-4 text-xs text-zinc-500">
                Certaines applications (WhatsApp, Telegram, Signal…) refusent parfois les numéros virtuels. Si aucun SMS n&apos;arrive après 2 minutes, consultez le guide de l&apos;application.
              </p>
            </motion.section>
          )}

          {demo && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Recevoir un code de vérification</h2>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-200">Simulateur · mode démo</span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              En usage réel, saisissez votre numéro Alter dans l&apos;application : le SMS arrive ici automatiquement. Testez dès maintenant avec le simulateur.
            </p>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
              {APPS.map((a) => (
                <button key={a.slug} type="button" onClick={() => setSelected(a.slug)} className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm transition-all ${selected === a.slug ? "border-violet-400/60 bg-violet-500/15 text-white" : "border-white/[0.08] text-zinc-400 hover:text-white"}`}>
                  <AppIcon app={a} size="xs" /> {a.name}
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={requestCode} disabled={requesting} className="btn-primary">
                {requesting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {requesting ? `En attente du SMS ${selectedApp.sms.sender}…` : `Demander un code ${selectedApp.name}`}
              </button>
              <p className="text-xs text-zinc-500">Délai moyen : 2 à 5 secondes.</p>
            </div>
            {requestError && <p className="mt-3 text-sm text-rose-300">{requestError}</p>}
          </motion.section>
          )}

          <motion.section id="bibliotheque" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="scroll-mt-28 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Guides par application</h2>
                <p className="mt-1 text-sm text-zinc-400">Chaque guide est personnalisé avec votre numéro : où le saisir, quels réglages activer, que faire si le SMS n&apos;arrive pas.</p>
              </div>
              <Link href="/guide" className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 hover:text-white">
                <BookOpen className="h-4 w-4" /> Aide
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {APPS.map((a, i) => {
                const done = downloaded.includes(a.slug);
                return (
                  <motion.div key={a.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.025 }} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 transition-colors hover:border-white/15">
                    <AppIcon app={a} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Link href={`/applications/${a.slug}`} className="block truncate text-sm font-semibold text-white hover:text-violet-200">
                        {a.name}
                      </Link>
                      <p className="truncate text-xs text-zinc-500">{a.tags.join(" · ")}</p>
                    </div>
                    <a
                      href={`/api/download/${a.slug}`}
                      target="_blank"
                      rel="noopener"
                      onClick={() => setDownloaded((d) => (d.includes(a.slug) ? d : [...d, a.slug]))}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${done ? "bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20" : "bg-violet-500/20 text-violet-100 hover:bg-violet-500/30"}`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                      {done ? "Re-télécharger" : "Guide"}
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h3 className="font-semibold text-white">Votre compte</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="text-zinc-500">E-mail</dt><dd className="truncate text-zinc-200">{customer.email}</dd></div>
                <div><dt className="text-zinc-500">Membre depuis</dt><dd suppressHydrationWarning className="text-zinc-200">{new Date(customer.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
                <div><dt className="text-zinc-500">Offre</dt><dd className="text-zinc-200">{phone.model}</dd></div>
                <div>
                  <dt className="text-zinc-500">Numéro actif jusqu&apos;au</dt>
                  <dd suppressHydrationWarning className="text-zinc-200">
                    {phone.expiresAt ? new Date(phone.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "Sans date de fin"}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h3 className="font-semibold text-white">Clé d&apos;accès</h3>
              <p className="mt-2 flex-1 text-sm text-zinc-400">Clé perdue ou partagée par erreur ? Générez-en une nouvelle : l&apos;ancienne sera immédiatement désactivée.</p>
              <button type="button" onClick={rotateKey} disabled={rotating} className="btn-ghost mt-5 !py-2.5 text-sm">
                {rotating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Générer une nouvelle clé
              </button>
            </div>
          </motion.section>

          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-zinc-500">
            <Logo className="scale-75" /> Usage responsable : ne communiquez jamais un code reçu à un tiers.
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalKey && (
          <KeyModal
            title={modalKey.welcome ? "Bienvenue dans Alter !" : "Nouvelle clé d'accès"}
            intro={modalKey.welcome ? "Votre numéro est activé. Voici votre clé d'accès personnelle pour vous reconnecter depuis n'importe quel appareil." : "Votre nouvelle clé est active. L'ancienne ne fonctionne plus."}
            accessKey={modalKey.key}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
