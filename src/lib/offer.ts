/**
 * Offre commerciale : un seul endroit à modifier pour changer le prix ou la durée.
 *
 * Pourquoi un pass de 12 mois plutôt qu'un paiement unique « à vie » ?
 * Un numéro mobile français loué chez un fournisseur (Twilio, Vonage, Plivo…) coûte
 * environ 1 à 3 € par mois, plus la réception des SMS. À 15 € une seule fois, chaque
 * client devient déficitaire au bout de quelques mois. Un pass annuel sans reconduction
 * automatique reste simple et honnête, tout en couvrant les coûts.
 */
export const OFFER = {
  name: "Alter One",
  priceCents: 2900,
  /** Prix affiché court, ex. dans les boutons. */
  priceShort: "29 €",
  /** Prix affiché avec centimes, ex. dans le récapitulatif de commande. */
  priceLong: "29,00 €",
  durationMonths: 12,
  durationLabel: "12 mois",
  /** Équivalent mensuel, pour la comparaison avec un forfait. */
  monthlyEquivalent: "2,42 €",
  vatRate: 0.2,
} as const;

export function formatEuros(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

export function priceBreakdown() {
  const ht = Math.round(OFFER.priceCents / (1 + OFFER.vatRate));
  return { ht: formatEuros(ht), tva: formatEuros(OFFER.priceCents - ht), ttc: formatEuros(OFFER.priceCents) };
}

/** Date de fin d'un pass démarré à `from`. */
export function passEndDate(from = new Date()): Date {
  const end = new Date(from);
  end.setMonth(end.getMonth() + OFFER.durationMonths);
  return end;
}

/**
 * Mode démonstration (faux paiement + simulateur de SMS).
 * Jamais actif en production, sauf si ALTER_DEMO_MODE=1 est posé explicitement
 * (ex. un site de démo). Sans Stripe en production, la commande est simplement refusée :
 * on ne collecte jamais de numéro de carte sans réellement passer par un prestataire de paiement.
 */
export function isDemoMode(): boolean {
  if (process.env.ALTER_DEMO_MODE === "1") return true;
  if (process.env.ALTER_DEMO_MODE === "0") return false;
  return process.env.NODE_ENV !== "production" && !process.env.STRIPE_SECRET_KEY;
}
