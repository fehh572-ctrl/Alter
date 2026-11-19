import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/app-icon";
import { LoginForm } from "@/components/login-form";
import { getCurrentCustomer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion à mon espace",
  description: "Accédez à votre numéro Alter, à vos codes de vérification et à vos guides.",
};

export const dynamic = "force-dynamic";

export default async function ConnexionPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const rawNext = typeof sp.next === "string" ? sp.next : "/espace";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/espace";
  const customer = await getCurrentCustomer();
  if (customer) redirect(next);
  const notice = sp.deja ? "Cette commande est déjà activée. Connectez-vous avec votre clé d'accès." : typeof sp.next === "string" ? "Connectez-vous pour télécharger ce pack." : null;

  return (
    <div className="relative flex min-h-[85vh] items-center overflow-hidden pt-28">
      <div className="bg-grid absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="relative mx-auto w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">Bon retour</h1>
          <p className="mt-2 text-zinc-400">Retrouvez votre numéro, vos codes et vos guides.</p>
        </div>
        <LoginForm next={next} notice={notice} />
      </div>
    </div>
  );
}
