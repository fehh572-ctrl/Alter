import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OFFER } from "@/lib/offer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alter — Un numéro dédié à vos codes de vérification",
    template: "%s · Alter",
  },
  description:
    `Un numéro français pour recevoir les codes de vérification de vos comptes pro et en ligne, sans donner votre numéro personnel. ${OFFER.priceShort} pour ${OFFER.durationLabel}, sans reconduction.`,
  keywords: ["numéro virtuel", "second numéro", "code de vérification", "SMS de vérification", "double authentification", "numéro pro", "vie privée", "Vinted Pro", "Instagram"],
  openGraph: {
    title: "Alter — Un numéro dédié à vos codes de vérification",
    description: `Gardez votre numéro perso pour vos proches. Un numéro français pour vos codes de vérification, ${OFFER.priceShort} pour ${OFFER.durationLabel}.`,
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  themeColor: "#06060c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-ink font-sans text-zinc-200 antialiased">
        <SiteHeader />
        <main className="relative">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
