import Link from "next/link";
import { ArrowLeft, PhoneOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 pt-28">
      <div className="bg-grid absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[380px] w-[560px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="relative text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
          <PhoneOff className="h-9 w-9 text-violet-300" />
        </div>
        <p className="mt-8 font-mono text-sm text-violet-300">ERREUR 404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Ce numéro n&apos;est pas attribué</h1>
        <p className="mt-4 text-zinc-400">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
        <Link href="/" className="btn-primary mt-10">
          <ArrowLeft className="h-4 w-4" /> Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
