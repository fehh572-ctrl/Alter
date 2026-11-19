import { randomInt } from "crypto";
import type { CodeFormat, DualApp } from "@/lib/apps";

/**
 * Numéros de démonstration : plage 06 39 98 XX XX réservée par l'ARCEP à la fiction.
 * Aucun de ces numéros n'appartient à un abonné réel. En production, les numéros
 * proviennent de votre opérateur / fournisseur SMS (voir /api/sms/inbound).
 */
export function generateDemoNumber(): string {
  const suffix = randomInt(0, 10000).toString().padStart(4, "0");
  return `+3363998${suffix}`;
}

export function formatNumber(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith("33") && digits.length === 11) {
    const n = digits.slice(2);
    return `+33 ${n[0]} ${n.slice(1, 3)} ${n.slice(3, 5)} ${n.slice(5, 7)} ${n.slice(7, 9)}`;
  }
  return e164;
}

export function generateCode(digits: number): string {
  let code = "";
  for (let i = 0; i < digits; i++) code += randomInt(0, 10).toString();
  if (code[0] === "0") code = `${randomInt(1, 10)}${code.slice(1)}`;
  return code;
}

export function formatCode(code: string, format: CodeFormat = "plain"): string {
  if (format === "dash" && code.length === 6) return `${code.slice(0, 3)}-${code.slice(3)}`;
  if (format === "space" && code.length === 6) return `${code.slice(0, 3)} ${code.slice(3)}`;
  return code;
}

export function renderSms(app: DualApp, code: string): string {
  return app.sms.template.replace("{code}", formatCode(code, app.sms.format));
}

export function extractCode(body: string): string | null {
  const match = body.match(/(\d{3}[-\s]\d{3})|(\d{4,8})/);
  if (!match) return null;
  return match[0].replace(/\D/g, "");
}
