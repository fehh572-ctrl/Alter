import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import type { DualApp } from "@/lib/apps";

export function AppCard({ app }: { app: DualApp }) {
  return (
    <Link
      href={`/applications/${app.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.18] hover:bg-white/[0.05]"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ background: app.color[0] }}
      />
      <div className="relative flex items-start justify-between">
        <AppIcon app={app} size="md" className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-zinc-400">{app.category}</span>
      </div>
      <h3 className="relative mt-5 text-lg font-semibold text-white">{app.name}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{app.tagline}</p>
      <div className="relative mt-5 flex flex-wrap gap-1.5">
        {app.tags.map((t) => (
          <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
            {t}
          </span>
        ))}
      </div>
      <span className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 transition-colors group-hover:text-white">
        Voir le guide <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
