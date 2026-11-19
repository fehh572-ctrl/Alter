import type { DualApp } from "@/lib/apps";
import { formatNumber } from "@/lib/phone";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export const ANDROID_BRANDS = [
  { brand: "Samsung", path: "Paramètres › Fonctions avancées › Dual Messenger" },
  { brand: "Xiaomi / Redmi / Poco", path: "Paramètres › Applications › Double applications" },
  { brand: "Oppo / Realme", path: "Paramètres › Applications › Clonage d'applications" },
  { brand: "OnePlus", path: "Paramètres › Applications › Applications parallèles" },
  { brand: "Huawei / Honor", path: "Paramètres › Applications › App Twin" },
  { brand: "Vivo", path: "Paramètres › Applications › Cloner l'application" },
  { brand: "Google Pixel & autres", path: "Installez « Shelter » (open source) pour créer un profil isolé, puis clonez l'application dedans" },
];

export function buildSteps(app: DualApp, numberLabel: string) {
  return [
    { title: "Vérifiez ce que la plateforme autorise", text: app.tips[0] },
    {
      title: "Ajoutez le compte sur votre téléphone",
      text: app.nativeMulti
        ? `${app.name} gère plusieurs comptes nativement : ajoutez simplement un compte depuis l'application. Sur Android, vous pouvez aussi utiliser le clonage natif ci-dessous.`
        : `Sur Android, utilisez la fonction de clonage native de votre téléphone (tableau ci-dessous). Sur iPhone : ${app.iosMethod}`,
    },
    { title: "Saisissez votre numéro Alter", text: `Lorsque ${app.name} demande un numéro (inscription ou double authentification), saisissez ${numberLabel}.` },
    { title: "Récupérez le code dans votre espace", text: `Le SMS de ${app.sms.sender} arrive dans votre espace Alter en quelques secondes. Copiez le code et validez.` },
    { title: "Sécurisez le compte", text: "Activez la double authentification et notez vos identifiants dans un gestionnaire de mots de passe." },
  ];
}

export function buildGuideHtml(app: DualApp, number: string, name: string): string {
  const steps = buildSteps(app, formatNumber(number));
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Guide ${esc(app.name)} — votre numéro Alter</title>
<style>
body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#07070d;color:#e4e4e7;line-height:1.6}
.wrap{max-width:760px;margin:0 auto;padding:40px 22px}
.badge{display:inline-block;padding:4px 12px;border-radius:999px;background:linear-gradient(90deg,${app.color[0]},${app.color[1]});color:#09090b;font-weight:700;font-size:12px}
h1{font-size:32px;margin:14px 0 6px}h2{margin-top:36px;font-size:20px}
.card{background:#111118;border:1px solid #27272a;border-radius:16px;padding:18px 20px;margin:12px 0}
.num{font-family:ui-monospace,monospace;font-size:22px;color:#c4b5fd}
ol{padding-left:20px}li{margin:10px 0}
table{width:100%;border-collapse:collapse;font-size:14px}td{border-bottom:1px solid #27272a;padding:10px 6px;vertical-align:top}
.muted{color:#a1a1aa;font-size:14px}
</style></head><body><div class="wrap">
<span class="badge">ALTER · GUIDE ${esc(app.name.toUpperCase())}</span>
<h1>${esc(app.name)} avec votre numéro Alter</h1>
<p class="muted">Guide personnalisé pour ${esc(name)} — ${esc(app.tagline)}</p>
<div class="card"><div class="muted">Votre numéro Alter (codes de vérification uniquement)</div><div class="num">${esc(formatNumber(number))}</div></div>
<h2>Pourquoi un numéro dédié pour ${esc(app.name)} ?</h2>
${app.benefits.map((b) => `<div class="card"><strong>${esc(b.title)}</strong><br><span class="muted">${esc(b.text)}</span></div>`).join("")}
<h2>Pas à pas</h2>
<ol>${steps.map((s) => `<li><strong>${esc(s.title)}</strong><br><span class="muted">${esc(s.text)}</span></li>`).join("")}</ol>
<h2>Deux comptes sur Android (fonction du fabricant)</h2>
<table>${ANDROID_BRANDS.map((b) => `<tr><td><strong>${esc(b.brand)}</strong></td><td class="muted">${esc(b.path)}</td></tr>`).join("")}</table>
<h2>Sur iPhone</h2><div class="card muted">${esc(app.iosMethod)}</div>
<h2>Conseils spécifiques à ${esc(app.name)}</h2>
<ul>${app.tips.map((t) => `<li class="muted">${esc(t)}</li>`).join("")}</ul>
<h2>Usage responsable</h2>
<p class="muted">Respectez les conditions d'utilisation de ${esc(app.name)}. Alter ne doit pas servir à contourner une sanction légitime, à frauder ou à usurper l'identité d'un tiers. Ne communiquez jamais un code de vérification à une autre personne.</p>
</div></body></html>`;
}
