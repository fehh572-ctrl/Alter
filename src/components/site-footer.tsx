import Link from "next/link";
import { Lock, ShieldCheck, Zap } from "lucide-react";
import { Logo } from "@/components/app-icon";
import { POPULAR_APPS } from "@/lib/apps";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-ink-2/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
            Un numéro français dédié à vos codes de vérification. Votre numéro personnel reste pour vos proches.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
              <Lock className="h-3.5 w-3.5 text-violet-300" /> Paiement sécurisé
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-fuchsia-300" /> Activation instantanée
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> Données en France
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Produit</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            <li><Link className="hover:text-white" href="/#fonctionnement">Fonctionnement</Link></li>
            <li><Link className="hover:text-white" href="/#tarif">Tarif</Link></li>
            <li><Link className="hover:text-white" href="/commander">Commander</Link></li>
            <li><Link className="hover:text-white" href="/connexion">Mon espace</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Guides</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            {POPULAR_APPS.slice(0, 5).map((a) => (
              <li key={a.slug}>
                <Link className="hover:text-white" href={`/applications/${a.slug}`}>Guide {a.name}</Link>
              </li>
            ))}
            <li><Link className="text-violet-300 hover:text-white" href="/applications">Toutes les applications →</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Aide</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            <li><Link className="hover:text-white" href="/guide">Guide d&apos;installation</Link></li>
            <li><Link className="hover:text-white" href="/#faq">FAQ</Link></li>
            <li><Link className="hover:text-white" href="/conditions">Conditions & usage responsable</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Alter. Tous droits réservés.</p>
          <p>Les marques citées appartiennent à leurs propriétaires respectifs. Alter n&apos;est affilié à aucune de ces plateformes.</p>
        </div>
      </div>
    </footer>
  );
}
