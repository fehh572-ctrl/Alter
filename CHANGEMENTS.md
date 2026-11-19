# Changements apportés à Alter

## Positionnement
- Le message passe de « apps en double / deuxième téléphone » à **« un numéro dédié à vos codes de vérification, votre numéro perso reste privé »**.
- Les promesses qui poussaient à enfreindre les règles des plateformes ont été retirées ou corrigées :
  - Vinted : un compte particulier + un compte Pro par personne (règle officielle), plus de « second compte perso » ni de « compte de secours après suspension ».
  - Snapchat : plus de recommandation de clonage (risque de blocage du compte).
  - « Monétisation x2 » remplacé par des formulations neutres (deux audiences, contenu original).
- Les « packs .zip » deviennent des **guides HTML** qui s'ouvrent directement dans le navigateur (plus d'archive à décompresser, plus de taille de fichier qui faisait croire à une application téléchargée). `jszip` est retiré des dépendances.
- Chiffres non vérifiables retirés (« des milliers de personnes », « code reçu en 2,8 s », bandeau de stats).

## Prix
- Tout est centralisé dans `src/lib/offer.ts`.
- Passage de **15 € à vie** à **29 € pour 12 mois, sans reconduction automatique**. Un numéro mobile FR coûte environ 1 à 3 €/mois chez un fournisseur : à 15 € une fois, chaque client devient déficitaire.
- Nouvelle colonne `phones.expires_at` (fin du pass), affichée dans l'espace membre. Les SMS reçus après expiration sont ignorés.

## Sécurité
- **Faux formulaire de carte bancaire désactivé en production** : sans `STRIPE_SECRET_KEY`, la commande est refusée au lieu de faire saisir une vraie carte sans débit. Le mode démo reste actif en développement (ou avec `ALTER_DEMO_MODE=1`).
- **Simulateur de SMS désactivé en production** : un client payant ne voit plus jamais de faux codes dans sa boîte.
- Webhook SMS : secret uniquement dans l'en-tête (plus dans l'URL, qui finit dans les logs), comparaison à temps constant.

## Forme
- Page d'accueil raccourcie (12 → 10 sections) et réordonnée : problème → fonctionnement → démo → comparatif → prix → guides → FAQ.
- FAQ réécrite (compatibilité réelle des numéros virtuels, fin du pass, légalité).

## À faire avant le lancement
1. `npx drizzle-kit push` pour créer la colonne `expires_at`.
2. Webhook Stripe (`checkout.session.completed`) : aujourd'hui l'activation dépend du retour du navigateur sur `/api/checkout/stripe-return`. Si l'onglet est fermé, le client paie sans être activé.
3. Parcours de renouvellement (e-mail avant échéance + paiement d'un nouveau pass pour un client existant). Aujourd'hui, `/api/checkout` refuse un e-mail déjà client.
4. Politique de réattribution des numéros expirés (délai de quarantaine) pour qu'un nouveau client ne reçoive pas les codes de l'ancien.
5. Faire relire les CGV par un juriste (droit de rétractation, mentions légales, statut d'opérateur auprès de l'Arcep si vous revendez des numéros).
6. Tester en réel la réception des SMS sur chaque app de la liste et retirer celles qui refusent les numéros virtuels.
