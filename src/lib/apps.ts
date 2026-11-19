export type IconKey =
  | "shirt"
  | "clapperboard"
  | "camera"
  | "credit-card"
  | "message-circle"
  | "send"
  | "ghost"
  | "tag"
  | "gamepad"
  | "at-sign"
  | "shopping-bag"
  | "mail"
  | "play"
  | "tv"
  | "gavel"
  | "shield-check"
  | "pin"
  | "wallet";

export type AppCategory = "Réseaux sociaux" | "E-commerce" | "Business & pro" | "Messagerie" | "Créateurs";

export type CodeFormat = "plain" | "dash" | "space" | "google";

export type DualApp = {
  slug: string;
  name: string;
  category: AppCategory;
  icon: IconKey;
  color: [string, string];
  logo?: string;
  tile?: string;
  tagline: string;
  description: string;
  benefits: { title: string; text: string }[];
  tags: string[];
  sms: { sender: string; template: string; digits: number; format?: CodeFormat };
  tips: string[];
  nativeMulti: boolean;
  iosMethod: string;
  packSize: string;
  popular?: boolean;
};

export const CATEGORIES: AppCategory[] = ["Réseaux sociaux", "E-commerce", "Business & pro", "Messagerie", "Créateurs"];

export const APPS: DualApp[] = [
  {
    slug: "vinted",
    logo: "/logos/vinted.svg",
    tile: "#007782",
    name: "Vinted",
    category: "E-commerce",
    icon: "shirt",
    color: ["#2dd4bf", "#0e7490"],
    tagline: "Votre dressing perso et votre compte Pro, bien séparés.",
    description:
      "Vinted autorise un compte particulier et un compte Pro par personne. Si la revente devient une activité, le compte Pro est la bonne voie : messagerie, avis, statistiques et paiements restent distincts de votre dressing perso. Votre numéro Alter sert à le vérifier sans y lier votre ligne personnelle.",
    benefits: [
      { title: "Perso et Pro séparés", text: "Suivez vos ventes pro sur un compte dédié, sans mélanger vos ventes personnelles." },
      { title: "Réputation cloisonnée", text: "Un litige sur votre activité pro n'apparaît pas sur votre profil perso." },
      { title: "Numéro protégé", text: "Votre ligne personnelle n'est pas associée à votre activité de vendeur." },
      { title: "Compta plus simple", text: "Des chiffres de vente propres, prêts pour votre déclaration." },
    ],
    tags: ["Compte Pro", "Réputation", "Vie privée"],
    sms: { sender: "Vinted", template: "Vinted : {code} est votre code de vérification. Ne le communiquez à personne.", digits: 6 },
    tips: [
      "Utilisez une adresse e-mail différente pour chaque compte (une adresse Gmail dédiée fonctionne très bien).",
      "Vinted n'autorise qu'un compte particulier et un compte Pro par personne : n'ouvrez pas de second compte particulier.",
      "Si vous vendez régulièrement pour faire du bénéfice, le statut de vendeur professionnel est une obligation légale.",
    ],
    nativeMulti: false,
    iosMethod: "Ouvrez vinted.fr dans Safari, connectez le second compte puis Partager › Sur l'écran d'accueil.",
    packSize: "1,4 Mo",
    popular: true,
  },
  {
    slug: "tiktok",
    logo: "/logos/tiktok.svg",
    tile: "#ffffff",
    name: "TikTok",
    category: "Réseaux sociaux",
    icon: "clapperboard",
    color: ["#f472b6", "#22d3ee"],
    tagline: "Une niche par compte. Deux algorithmes qui travaillent pour vous.",
    description:
      "L'algorithme de TikTok apprend de chaque vidéo : mélanger cuisine, gaming et business sur un même compte brouille votre audience. Avec un second compte, vous lancez une nouvelle niche sans casser l'engagement du premier, et chaque compte peut viser sa propre monétisation.",
    benefits: [
      { title: "Deux audiences", text: "Chaque compte construit sa propre communauté et peut viser sa propre monétisation, avec du contenu original." },
      { title: "Tester une niche", text: "Validez une idée de contenu sans risquer les statistiques de votre compte principal." },
      { title: "Perso / créateur", text: "Un compte privé pour scroller librement sans fausser l'algorithme de votre compte pro." },
      { title: "Compte de secours", text: "Un backup pour prévenir votre communauté si votre compte principal est piraté." },
    ],
    tags: ["Multi-niches", "Créateur", "Vie privée"],
    sms: { sender: "TikTok", template: "[TikTok] {code} est votre code de vérification", digits: 6 },
    tips: [
      "Ne republiez pas les mêmes vidéos sur les deux comptes : le contenu dupliqué est pénalisé.",
      "Laissez « chauffer » le nouveau compte quelques jours avec une utilisation naturelle.",
      "Chaque compte doit publier du contenu original pour être éligible à la monétisation.",
    ],
    nativeMulti: true,
    iosMethod: "TikTok gère plusieurs comptes nativement : Profil › nom du compte › Ajouter un compte.",
    packSize: "1,6 Mo",
    popular: true,
  },
  {
    slug: "instagram",
    logo: "/logos/instagram.svg",
    tile: "linear-gradient(45deg,#F58529 0%,#DD2A7B 55%,#8134AF 100%)",
    name: "Instagram",
    category: "Réseaux sociaux",
    icon: "camera",
    color: ["#f59e0b", "#d946ef"],
    tagline: "Compte privé, compte créateur : chacun son audience.",
    description:
      "Instagram autorise plusieurs comptes, mais chaque nouveau compte doit être vérifié avec un e-mail ou un numéro distinct. Votre numéro Alter devient la clé pour ouvrir un compte marque, créateur ou client, sans jamais exposer votre numéro personnel.",
    benefits: [
      { title: "Perso & pro séparés", text: "Stories privées pour vos proches, contenu public pour votre audience." },
      { title: "Multi-marques", text: "Freelance ou community manager : un compte par client ou par projet." },
      { title: "Vie privée", text: "Un numéro distinct évite que votre compte pro soit suggéré à vos contacts téléphoniques." },
      { title: "Compte backup", text: "Prévenez vos abonnés en cas de piratage : une pratique courante chez les créateurs." },
    ],
    tags: ["Multi-marques", "Vie privée", "Compte backup"],
    sms: { sender: "Instagram", template: "Utilisez {code} pour vérifier votre compte Instagram.", digits: 6, format: "space" },
    tips: [
      "Ajoutez le compte via Profil › Menu › Ajouter un compte.",
      "Activez la double authentification sur chaque compte, idéalement via une application.",
      "Passez le compte en « Professionnel » pour accéder aux statistiques.",
    ],
    nativeMulti: true,
    iosMethod: "Multi-comptes natif : Profil › nom du compte › Ajouter un compte Instagram.",
    packSize: "1,5 Mo",
    popular: true,
  },
  {
    slug: "stripe",
    logo: "/logos/stripe.svg",
    tile: "#635BFF",
    name: "Stripe",
    category: "Business & pro",
    icon: "credit-card",
    color: ["#818cf8", "#4f46e5"],
    tagline: "Un numéro dédié à la sécurité de votre business.",
    description:
      "Stripe protège chaque compte par une double authentification par SMS. La lier à votre numéro perso pose problème dès que vous travaillez à plusieurs. Avec Alter, vous dédiez un numéro à votre activité, séparez plusieurs entreprises (Stripe autorise plusieurs comptes) et partagez la 2FA avec votre associé ou votre comptable.",
    benefits: [
      { title: "2FA partagée", text: "Associé, comptable, assistant : chacun récupère le code dans l'espace Alter." },
      { title: "Plusieurs activités", text: "Une boutique, une activité freelance : des comptes séparés pour une compta propre." },
      { title: "Continuité", text: "Changement, perte ou vol de téléphone : votre 2FA reste accessible en ligne." },
      { title: "Pro & perso", text: "Votre numéro personnel n'apparaît jamais dans vos paramètres business." },
    ],
    tags: ["2FA d'équipe", "Multi-entreprises", "Continuité"],
    sms: { sender: "Stripe", template: "Votre code de vérification Stripe est : {code}. Ne le communiquez à personne.", digits: 6, format: "space" },
    tips: [
      "Chaque compte Stripe doit correspondre à une activité réelle et vérifiée à votre nom (KYC).",
      "Dashboard › Paramètres › Équipe et sécurité pour gérer la double authentification.",
      "Ajoutez une entreprise via le sélecteur de comptes en haut à gauche du Dashboard.",
    ],
    nativeMulti: true,
    iosMethod: "Utilisez l'app Stripe Dashboard ou dashboard.stripe.com : le sélecteur de comptes est natif.",
    packSize: "1,1 Mo",
    popular: true,
  },
  {
    slug: "whatsapp",
    name: "WhatsApp",
    category: "Messagerie",
    icon: "message-circle",
    color: ["#4ade80", "#15803d"],
    tagline: "Un WhatsApp pro sans donner votre numéro perso.",
    description:
      "Clients, petites annonces, associations : donner votre numéro personnel, c'est ouvrir la porte aux messages à toute heure. Un second WhatsApp (ou WhatsApp Business) vérifié avec votre numéro Alter crée une frontière nette entre vie privée et vie pro.",
    benefits: [
      { title: "WhatsApp Business", text: "Catalogue, réponses automatiques et horaires d'ouverture sur un numéro dédié." },
      { title: "Vraie déconnexion", text: "Coupez les notifications pro le soir sans rater les messages de vos proches." },
      { title: "Annonces & ventes", text: "Échangez avec des inconnus sans jamais révéler votre vrai numéro." },
    ],
    tags: ["Pro / perso", "Business", "Vie privée"],
    sms: { sender: "WhatsApp", template: "Votre code WhatsApp : {code}. Ne partagez ce code avec personne.", digits: 6, format: "dash" },
    tips: [
      "WhatsApp Business s'installe à côté de WhatsApp, sans aucun clonage.",
      "WhatsApp refuse parfois les numéros virtuels : si le SMS n'arrive pas, n'insistez pas plus de 2 ou 3 fois (risque de blocage temporaire).",
      "Activez la vérification en deux étapes (code PIN) dès la première connexion.",
      "Sur Android récent : Paramètres WhatsApp › flèche à côté du nom › Ajouter un compte.",
    ],
    nativeMulti: true,
    iosMethod: "Installez WhatsApp Business depuis l'App Store à côté de WhatsApp.",
    packSize: "1,2 Mo",
    popular: true,
  },
  {
    slug: "snapchat",
    logo: "/logos/snapchat.svg",
    tile: "#FFFC00",
    name: "Snapchat",
    category: "Réseaux sociaux",
    icon: "ghost",
    color: ["#fde047", "#f59e0b"],
    tagline: "Spotlight d'un côté, vos amis de l'autre.",
    description:
      "Snapchat rémunère les créateurs via Spotlight, mais votre compte perso n'est pas fait pour une audience publique. Un second compte vous permet de publier pour le grand public tout en gardant vos snaps, votre Snap Map et vos amis strictement privés.",
    benefits: [
      { title: "Monétisation créateur", text: "Un compte public dédié à Spotlight et aux Stories publiques." },
      { title: "Cercle privé protégé", text: "Vos amis et votre position restent sur votre compte personnel." },
      { title: "Commerce local", text: "Faites la promotion de votre activité avec un profil public dédié." },
    ],
    tags: ["Spotlight", "Vie privée", "Créateur"],
    sms: { sender: "Snapchat", template: "Code Snapchat : {code}. Bon snap !", digits: 6, format: "dash" },
    tips: [
      "Snapchat ne gère qu'un compte à la fois dans l'app : basculez en vous déconnectant, ou utilisez Snapchat pour le Web. Évitez les apps de clonage tierces, qui peuvent entraîner un blocage du compte.",
      "Désactivez la synchronisation des contacts sur le compte public.",
      "Activez le mode fantôme sur le compte créateur.",
    ],
    nativeMulti: false,
    iosMethod: "Utilisez Snapchat pour le Web (web.snapchat.com) dans Safari, ajouté à l'écran d'accueil.",
    packSize: "1,3 Mo",
    popular: true,
  },
  {
    slug: "leboncoin",
    logo: "/logos/leboncoin.svg",
    tile: "#FF6E14",
    name: "Leboncoin",
    category: "E-commerce",
    icon: "tag",
    color: ["#fb923c", "#ea580c"],
    tagline: "Une activité, un compte. Votre numéro perso reste à l'abri.",
    description:
      "Immobilier, véhicules, déstockage, ventes perso : tout mélanger sur un seul compte rend la messagerie illisible. Un second compte vérifié avec Alter sépare vos activités et tient votre numéro personnel loin du démarchage et des tentatives d'arnaque.",
    benefits: [
      { title: "Particulier / pro", text: "Séparez vos ventes perso de votre activité professionnelle." },
      { title: "Moins de démarchage", text: "Votre numéro personnel n'est jamais associé à vos annonces." },
      { title: "Messageries lisibles", text: "Un compte par activité, des conversations enfin organisées." },
    ],
    tags: ["Multi-activités", "Anti-spam", "Pro / perso"],
    sms: { sender: "leboncoin", template: "leboncoin : votre code de vérification est {code}.", digits: 6 },
    tips: [
      "Ne communiquez jamais un code reçu à un acheteur : aucune vente légitime ne l'exige.",
      "Pour une activité régulière, ouvrez un compte Pro dédié.",
      "Utilisez une adresse e-mail différente pour chaque compte.",
    ],
    nativeMulti: false,
    iosMethod: "Ouvrez leboncoin.fr dans Safari, connectez le second compte puis ajoutez-le à l'écran d'accueil.",
    packSize: "1,2 Mo",
  },
  {
    slug: "telegram",
    logo: "/logos/telegram.svg",
    tile: "#229ED9",
    name: "Telegram",
    category: "Messagerie",
    icon: "send",
    color: ["#38bdf8", "#0369a1"],
    tagline: "Rejoignez des communautés sans dévoiler votre identité.",
    description:
      "Telegram utilise votre numéro pour vous retrouver et peut l'afficher selon vos réglages. Avec un numéro Alter, vous gérez canaux, groupes et bots sans lier votre identité réelle. Bonus : Telegram accepte nativement jusqu'à 3 comptes dans la même app.",
    benefits: [
      { title: "Anonymat", text: "Votre numéro réel n'est jamais visible par les membres des groupes." },
      { title: "Canaux & bots", text: "Un compte admin dédié à vos canaux, séparé de vos conversations privées." },
      { title: "Anti-spam", text: "Les groupes publics attirent le spam : votre vrai numéro reste protégé." },
    ],
    tags: ["Anonymat", "Communautés", "Multi-comptes natif"],
    sms: { sender: "Telegram", template: "Telegram code: {code}. Ne donnez ce code à personne.", digits: 5 },
    tips: [
      "Paramètres › Confidentialité › Numéro de téléphone › Personne.",
      "Ajoutez le compte via Paramètres › Ajouter un compte (jusqu'à 3).",
      "Activez le mot de passe de validation en deux étapes.",
    ],
    nativeMulti: true,
    iosMethod: "Multi-comptes natif : Paramètres › Ajouter un compte.",
    packSize: "1,0 Mo",
  },
  {
    slug: "gmail",
    logo: "/logos/gmail.svg",
    tile: "#ffffff",
    name: "Gmail",
    category: "Business & pro",
    icon: "mail",
    color: ["#f87171", "#b91c1c"],
    tagline: "La brique de base de tous vos seconds comptes.",
    description:
      "Presque chaque inscription demande une adresse e-mail distincte, et Google demande souvent un numéro pour valider un nouveau compte. Votre numéro Alter vous permet de créer une adresse dédiée à vos comptes secondaires, à votre activité ou à vos inscriptions.",
    benefits: [
      { title: "Une adresse par usage", text: "Pro, revente, newsletters : une boîte dédiée, une boîte de réception propre." },
      { title: "Récupération sécurisée", text: "Un numéro de récupération distinct de votre téléphone personnel." },
      { title: "Fondation multi-comptes", text: "L'e-mail qui servira à ouvrir vos comptes Vinted, TikTok ou YouTube." },
    ],
    tags: ["Essentiel", "Sécurité", "Organisation"],
    sms: { sender: "Google", template: "G-{code} est votre code de validation Google.", digits: 6, format: "google" },
    tips: [
      "Gmail gère plusieurs comptes nativement : avatar › Ajouter un autre compte.",
      "Ajoutez une adresse de récupération en plus du numéro.",
      "Créez cette adresse en premier : elle servira à vos autres comptes.",
    ],
    nativeMulti: true,
    iosMethod: "Multi-comptes natif dans l'app Gmail : avatar › Ajouter un autre compte.",
    packSize: "0,9 Mo",
  },
  {
    slug: "youtube",
    logo: "/logos/youtube.svg",
    tile: "#FF0000",
    name: "YouTube",
    category: "Créateurs",
    icon: "play",
    color: ["#ef4444", "#7f1d1d"],
    tagline: "Une chaîne principale, une chaîne Shorts, une chaîne test.",
    description:
      "Beaucoup de créateurs lancent une seconde chaîne (Shorts, clips, coulisses, autre langue). YouTube demande une vérification par téléphone pour débloquer les miniatures personnalisées, les vidéos longues et le live. Un numéro dédié garde cette vérification indépendante de votre ligne perso.",
    benefits: [
      { title: "Deux chaînes", text: "Chaque chaîne a sa ligne éditoriale et peut viser le Programme Partenaire YouTube." },
      { title: "Fonctions avancées", text: "Vérifiez la chaîne pour les miniatures personnalisées et les vidéos de plus de 15 min." },
      { title: "Multi-langues", text: "Une chaîne par langue : des recommandations plus pertinentes." },
    ],
    tags: ["Multi-chaînes", "Créateur", "Vérification"],
    sms: { sender: "Google", template: "G-{code} est votre code de validation YouTube.", digits: 6, format: "google" },
    tips: [
      "Créez la seconde chaîne via un compte de marque pour pouvoir la partager.",
      "Vérification : youtube.com/verify, puis choisissez « SMS ».",
      "Chaque chaîne doit proposer un contenu original pour être monétisée.",
    ],
    nativeMulti: true,
    iosMethod: "Changement de chaîne natif : avatar › Changer de compte.",
    packSize: "1,3 Mo",
  },
  {
    slug: "discord",
    logo: "/logos/discord.svg",
    tile: "#5865F2",
    name: "Discord",
    category: "Messagerie",
    icon: "gamepad",
    color: ["#a5b4fc", "#5865f2"],
    tagline: "Modération, communauté, gaming : un compte par casquette.",
    description:
      "Discord exige parfois un numéro vérifié pour rejoindre ou modérer des serveurs. Un second compte vérifié sépare vos activités de modérateur ou de community manager de votre compte gaming personnel. Le sélecteur de comptes est intégré à l'app.",
    benefits: [
      { title: "Compte de modération", text: "Sanctions, tickets, logs : une identité pro pour vos serveurs." },
      { title: "Community management", text: "Gérez le serveur d'une marque sans y mêler votre profil perso." },
      { title: "Vie privée", text: "Vos amis gaming ne voient pas votre activité professionnelle." },
    ],
    tags: ["Modération", "Communauté", "Pro / perso"],
    sms: { sender: "Discord", template: "Votre code de vérification Discord est {code}", digits: 6 },
    tips: [
      "Ajoutez le compte via votre avatar › Changer de compte.",
      "Activez la 2FA par application sur les comptes administrateurs.",
      "Utilisez un pseudo distinct pour bien séparer les identités.",
    ],
    nativeMulti: true,
    iosMethod: "Sélecteur natif : avatar › Changer de compte › Ajouter un compte.",
    packSize: "1,1 Mo",
  },
  {
    slug: "x",
    logo: "/logos/x.svg",
    tile: "#000000",
    name: "X (Twitter)",
    category: "Réseaux sociaux",
    icon: "at-sign",
    color: ["#e4e4e7", "#52525b"],
    tagline: "Veille, marque, perso : chaque fil à sa place.",
    description:
      "Sur X, ce que vous suivez façonne votre fil. Un compte de veille, un compte de marque et un compte perso, ce sont trois fils propres et trois audiences cohérentes. L'app permet de basculer entre comptes, mais chacun demande sa propre vérification.",
    benefits: [
      { title: "Compte de veille", text: "Suivez concurrents et tendances sans polluer votre fil personnel." },
      { title: "Voix de marque", text: "Une voix officielle pour votre projet, distincte de vos opinions." },
      { title: "Monétisation", text: "Le partage de revenus se gère par compte : deux audiences, deux potentiels." },
    ],
    tags: ["Veille", "Marque", "Monétisation"],
    sms: { sender: "X", template: "Votre code de vérification X est {code}.", digits: 6 },
    tips: [
      "Ajoutez le compte via votre avatar › Ajouter un compte existant ou nouveau.",
      "Gardez une bio claire qui précise le rôle du compte.",
      "Activez la 2FA sur chaque compte.",
    ],
    nativeMulti: true,
    iosMethod: "Multi-comptes natif : appui long sur l'avatar › Ajouter un compte.",
    packSize: "1,0 Mo",
  },
  {
    slug: "shopify",
    logo: "/logos/shopify.svg",
    tile: "#95BF47",
    name: "Shopify",
    category: "Business & pro",
    icon: "shopping-bag",
    color: ["#a3e635", "#4d7c0f"],
    tagline: "Plusieurs boutiques, une sécurité pro.",
    description:
      "Lancer une seconde boutique (nouvelle niche, nouveau marché) est courant en e-commerce. Le numéro Alter sert de canal de vérification dédié à vos boutiques et à vos collaborateurs, séparé de votre téléphone personnel.",
    benefits: [
      { title: "Multi-boutiques", text: "Testez une nouvelle niche sans toucher à votre boutique principale." },
      { title: "Accès équipe", text: "Les codes de connexion restent accessibles à votre équipe." },
      { title: "Continuité 2FA", text: "Votre sécurité ne dépend plus d'un seul téléphone physique." },
    ],
    tags: ["Multi-boutiques", "Équipe", "2FA"],
    sms: { sender: "Shopify", template: "Votre code de connexion Shopify est {code}.", digits: 6 },
    tips: [
      "Chaque boutique supplémentaire se crée depuis votre compte Shopify.",
      "Donnez des accès collaborateurs plutôt que de partager vos identifiants.",
      "Activez la 2FA dans Paramètres › Sécurité.",
    ],
    nativeMulti: true,
    iosMethod: "L'app Shopify gère plusieurs boutiques : Boutique › Changer de boutique.",
    packSize: "1,0 Mo",
  },
  {
    slug: "paypal",
    logo: "/logos/paypal.svg",
    tile: "#ffffff",
    name: "PayPal",
    category: "Business & pro",
    icon: "wallet",
    color: ["#60a5fa", "#1e3a8a"],
    tagline: "Compte personnel et compte Business, enfin séparés.",
    description:
      "PayPal permet d'avoir un compte personnel et un compte Business. Garder les deux sur le même numéro complique la sécurité et la comptabilité. Un numéro dédié à votre compte Business clarifie les accès et protège vos encaissements.",
    benefits: [
      { title: "Perso / Business", text: "Vos achats perso ne se mélangent plus à vos encaissements pro." },
      { title: "2FA dédiée", text: "Les codes du compte Business arrivent dans votre espace Alter." },
      { title: "Compta propre", text: "Des relevés clairs pour votre expert-comptable." },
    ],
    tags: ["Business", "2FA", "Comptabilité"],
    sms: { sender: "PayPal", template: "PayPal : votre code de sécurité est {code}. Il expire dans 10 minutes.", digits: 6 },
    tips: [
      "Le compte Business doit être ouvert à votre nom ou au nom de votre entreprise.",
      "Utilisez une adresse e-mail différente du compte personnel.",
      "Activez la validation en deux étapes dans Paramètres › Sécurité.",
    ],
    nativeMulti: false,
    iosMethod: "Utilisez l'app PayPal Business à côté de l'app PayPal classique.",
    packSize: "1,0 Mo",
  },
  {
    slug: "twitch",
    logo: "/logos/twitch.svg",
    tile: "#9146FF",
    name: "Twitch",
    category: "Créateurs",
    icon: "tv",
    color: ["#c084fc", "#7e22ce"],
    tagline: "Une chaîne secondaire pour tester, rediffuser, modérer.",
    description:
      "Une chaîne Twitch secondaire sert à tester votre configuration de stream hors ligne, à héberger des rediffusions ou à faire tourner un compte bot de modération. Votre numéro Alter vérifie ces comptes sans encombrer votre numéro perso.",
    benefits: [
      { title: "Chaîne test", text: "Testez OBS, overlays et alertes en privé avant de passer en live." },
      { title: "Compte bot", text: "Un compte dédié à votre bot de modération ou d'alertes." },
      { title: "Multi-jeux", text: "Une chaîne par univers pour une audience plus fidèle." },
    ],
    tags: ["Chaîne test", "Bot", "Créateur"],
    sms: { sender: "Twitch", template: "Votre code de vérification Twitch : {code}", digits: 6 },
    tips: [
      "Utilisez une clé de stream différente pour chaque chaîne.",
      "Gardez la chaîne test hors des recommandations (aucune catégorie).",
      "Activez la 2FA sur la chaîne principale.",
    ],
    nativeMulti: false,
    iosMethod: "Ouvrez twitch.tv dans Safari pour la chaîne secondaire et ajoutez-la à l'écran d'accueil.",
    packSize: "1,1 Mo",
  },
  {
    slug: "ebay",
    logo: "/logos/ebay.svg",
    tile: "#ffffff",
    name: "eBay",
    category: "E-commerce",
    icon: "gavel",
    color: ["#facc15", "#2563eb"],
    tagline: "Achats perso et boutique pro sur deux comptes distincts.",
    description:
      "eBay distingue les comptes particuliers et professionnels. Séparer vos achats personnels de votre activité de vendeur garde vos évaluations, vos paiements et vos statistiques parfaitement propres.",
    benefits: [
      { title: "Évaluations séparées", text: "Vos achats perso n'interfèrent pas avec votre réputation de vendeur." },
      { title: "Boutique pro", text: "Un compte professionnel dédié avec ses propres réglages." },
      { title: "Statistiques fiables", text: "Des chiffres de vente qui reflètent uniquement votre activité." },
    ],
    tags: ["Pro / perso", "Réputation", "Revente"],
    sms: { sender: "eBay", template: "eBay : votre code de sécurité est {code}.", digits: 6 },
    tips: [
      "Déclarez le compte vendeur comme professionnel si vous vendez régulièrement.",
      "Utilisez une adresse e-mail dédiée.",
      "Activez la vérification en deux étapes.",
    ],
    nativeMulti: false,
    iosMethod: "Ouvrez ebay.fr dans Safari pour le second compte et ajoutez-le à l'écran d'accueil.",
    packSize: "1,1 Mo",
  },
  {
    slug: "signal",
    logo: "/logos/signal.svg",
    tile: "#ffffff",
    name: "Signal",
    category: "Messagerie",
    icon: "shield-check",
    color: ["#93c5fd", "#1d4ed8"],
    tagline: "Une messagerie chiffrée, sans lien avec votre vrai numéro.",
    description:
      "Signal chiffre tout, mais l'inscription repose sur un numéro de téléphone. Avec les noms d'utilisateur, vous pouvez échanger sans montrer votre numéro, encore faut-il que celui d'inscription ne soit pas personnel. Idéal pour les journalistes et les professions sensibles.",
    benefits: [
      { title: "Confidentialité maximale", text: "Votre identité téléphonique réelle n'est jamais liée au compte." },
      { title: "Usage pro sensible", text: "Échangez avec des sources ou des clients sans exposer votre ligne." },
      { title: "Nom d'utilisateur", text: "Partagez un pseudo plutôt qu'un numéro." },
    ],
    tags: ["Confidentialité", "Pro sensible", "Chiffrement"],
    sms: { sender: "Signal", template: "Votre code Signal est : {code}. Ne partagez pas ce code.", digits: 6, format: "dash" },
    tips: [
      "Paramètres › Confidentialité › Numéro de téléphone › Personne.",
      "Créez un nom d'utilisateur pour être contacté sans numéro.",
      "Activez le verrouillage d'inscription avec un code PIN.",
    ],
    nativeMulti: false,
    iosMethod: "Signal Desktop (Mac/PC) peut être lié au second compte vérifié depuis votre Alter.",
    packSize: "0,9 Mo",
  },
  {
    slug: "pinterest",
    logo: "/logos/pinterest.svg",
    tile: "#E60023",
    name: "Pinterest",
    category: "Créateurs",
    icon: "pin",
    color: ["#fb7185", "#be123c"],
    tagline: "Un compte Business pour transformer vos épingles en trafic.",
    description:
      "Pinterest est un moteur de recherche visuel qui génère du trafic pendant des mois. Un compte Business dédié donne accès aux statistiques et aux publicités, sans mélanger vos tableaux perso et votre stratégie de contenu.",
    benefits: [
      { title: "Trafic durable", text: "Des épingles qui ramènent des visiteurs vers votre site pendant des mois." },
      { title: "Stats Business", text: "Statistiques et publicités réservées au compte professionnel." },
      { title: "Tableaux séparés", text: "Votre inspiration perso reste privée." },
    ],
    tags: ["Trafic", "Business", "Créateur"],
    sms: { sender: "Pinterest", template: "Votre code Pinterest est {code}", digits: 6 },
    tips: [
      "Convertissez le compte en compte Business dans les paramètres.",
      "Revendiquez votre site web pour suivre le trafic.",
      "Publiez régulièrement des épingles verticales.",
    ],
    nativeMulti: true,
    iosMethod: "Multi-comptes natif : Profil › Ajouter un compte.",
    packSize: "1,0 Mo",
  },
];

export const POPULAR_APPS = APPS.filter((a) => a.popular);

export function getApp(slug: string): DualApp | undefined {
  return APPS.find((a) => a.slug === slug);
}

export const DUAL_REASONS = [
  { icon: "eye-off", title: "Votre vrai numéro reste privé", text: "Il n'apparaît ni dans les suggestions de contacts, ni chez les acheteurs, ni dans les fuites de données des plateformes." },
  { icon: "briefcase", title: "Pro & perso séparés", text: "Clients d'un côté, proches de l'autre. Vos notifications enfin sous contrôle." },
  { icon: "life-buoy", title: "Récupération sécurisée", text: "Perte, vol ou changement de téléphone : vos codes restent accessibles depuis votre espace." },
  { icon: "key", title: "2FA d'équipe", text: "Associé, comptable, assistant : partagez les codes de sécurité d'un compte pro sans prêter votre téléphone." },
  { icon: "ban", title: "Moins de spam et d'arnaques", text: "Inscrivez-vous sans exposer votre ligne personnelle au démarchage." },
  { icon: "users", title: "Gestion multi-clients", text: "Freelances, CM, agences : un numéro dédié aux comptes que vous gérez pour vos clients." },
  { icon: "coins", title: "Comptes créateurs", text: "Un compte public pour votre audience, votre compte perso reste entre amis." },
  { icon: "target", title: "Nouveau projet", text: "Ouvrez les comptes d'un projet ou d'une marque sans y mêler votre identité perso." },
] as const;
