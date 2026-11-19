"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, LoaderCircle, MessageSquare, Send } from "lucide-react";
import { useRef, useState } from "react";
import { AppIcon } from "@/components/app-icon";
import { PhoneFrame } from "@/components/phone-frame";
import { SectionHeading, Reveal } from "@/components/ui";
import { APPS, type DualApp } from "@/lib/apps";

type DemoSms = { id: number; app: DualApp; code: string; body: string };

function fakeCode(app: DualApp) {
  let c = "";
  for (let i = 0; i < app.sms.digits; i++) c += Math.floor(Math.random() * 10);
  if (c[0] === "0") c = "7" + c.slice(1);
  const f = app.sms.format;
  const shown = f === "dash" && c.length === 6 ? `${c.slice(0, 3)}-${c.slice(3)}` : f === "space" && c.length === 6 ? `${c.slice(0, 3)} ${c.slice(3)}` : c;
  return { code: c, body: app.sms.template.replace("{code}", shown) };
}

export function DemoSection() {
  const choices = APPS.slice(0, 8);
  const [selected, setSelected] = useState<DualApp>(choices[0]);
  const [state, setState] = useState<"idle" | "waiting">("idle");
  const [inbox, setInbox] = useState<DemoSms[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const idRef = useRef(0);

  const send = () => {
    if (state === "waiting") return;
    setState("waiting");
    const delay = 1200 + Math.random() * 1200;
    setTimeout(() => {
      const { code, body } = fakeCode(selected);
      idRef.current += 1;
      setInbox((prev) => [{ id: idRef.current, app: selected, code, body }, ...prev].slice(0, 5));
      setState("idle");
    }, delay);
  };

  const copy = async (sms: DemoSms) => {
    try {
      await navigator.clipboard.writeText(sms.code);
    } catch {
      /* ignore */
    }
    setCopied(sms.id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section className="relative py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(124,58,237,0.12),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Démo interactive"
          title={
            <>
              Testez la réception d&apos;un code, <span className="text-gradient">en direct</span>
            </>
          }
          subtitle="Choisissez une application, demandez un code : voici comment il s'affiche dans votre espace membre."
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="glass rounded-3xl p-6 sm:p-8">
              <p className="text-sm font-semibold text-white">1. Choisissez une application</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {choices.map((app) => {
                  const active = app.slug === selected.slug;
                  return (
                    <button
                      key={app.slug}
                      type="button"
                      onClick={() => setSelected(app)}
                      className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all ${
                        active ? "border-violet-400/60 bg-violet-500/10" : "border-white/[0.06] bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      {active && <motion.span layoutId="demo-active" className="absolute inset-0 rounded-2xl ring-2 ring-violet-400/50" />}
                      <AppIcon app={app} size="sm" />
                      <span className="truncate text-[11px] font-medium text-zinc-300">{app.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-8 text-sm font-semibold text-white">2. Demandez le code de vérification</p>
              <div className="mt-4 rounded-2xl border border-white/[0.08] bg-black/30 p-4">
                <p className="text-xs text-zinc-500">Numéro de téléphone saisi sur {selected.name}</p>
                <p className="mt-1 font-mono text-lg text-white">+33 6 39 98 •• ••</p>
              </div>
              <button type="button" onClick={send} disabled={state === "waiting"} className="btn-primary mt-5 w-full">
                {state === "waiting" ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Envoi du SMS par {selected.sms.sender}…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Recevoir un code {selected.name.split(" ")[0]}
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-zinc-500">Simulation à titre d&apos;illustration. Aucun SMS réel n&apos;est envoyé.</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <PhoneFrame>
              <div className="flex h-full flex-col px-3 pt-5">
                <div className="flex items-center gap-2 px-1">
                  <MessageSquare className="h-4 w-4 text-violet-300" />
                  <p className="text-sm font-semibold text-white">Messages</p>
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">{inbox.length}</span>
                </div>
                <div className="mt-4 flex flex-1 flex-col gap-2 overflow-hidden">
                  <AnimatePresence initial={false}>
                    {state === "waiting" && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3"
                      >
                        <AppIcon app={selected} size="xs" />
                        <span className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full bg-white/70"
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </span>
                      </motion.div>
                    )}
                    {inbox.map((sms) => (
                      <motion.button
                        type="button"
                        key={sms.id}
                        layout
                        onClick={() => copy(sms)}
                        initial={{ opacity: 0, y: -24, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-2">
                          <AppIcon app={sms.app} size="xs" />
                          <span className="text-[11px] font-semibold text-white">{sms.app.sms.sender}</span>
                          <span className="ml-auto flex items-center gap-1 text-[10px] text-violet-200">
                            {copied === sms.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied === sms.id ? "Copié" : "Copier"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[11px] leading-snug text-white/80">{sms.body}</p>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                  {inbox.length === 0 && state === "idle" && (
                    <div className="mt-16 text-center text-xs text-white/40">
                      Aucun message pour l&apos;instant.
                      <br />
                      Demandez un code →
                    </div>
                  )}
                </div>
              </div>
            </PhoneFrame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
