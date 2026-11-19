import type { CSSProperties } from "react";
import {
  AtSign,
  Ban,
  Briefcase,
  Camera,
  Clapperboard,
  Coins,
  CreditCard,
  EyeOff,
  Gamepad2,
  Gavel,
  Ghost,
  KeyRound,
  LifeBuoy,
  Mail,
  MessageCircle,
  Pin,
  Play,
  Send,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Tag,
  Target,
  Tv,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { DualApp, IconKey } from "@/lib/apps";

const APP_ICONS: Record<IconKey, LucideIcon> = {
  shirt: Shirt,
  clapperboard: Clapperboard,
  camera: Camera,
  "credit-card": CreditCard,
  "message-circle": MessageCircle,
  send: Send,
  ghost: Ghost,
  tag: Tag,
  gamepad: Gamepad2,
  "at-sign": AtSign,
  "shopping-bag": ShoppingBag,
  mail: Mail,
  play: Play,
  tv: Tv,
  gavel: Gavel,
  "shield-check": ShieldCheck,
  pin: Pin,
  wallet: Wallet,
};

export const REASON_ICONS: Record<string, LucideIcon> = {
  coins: Coins,
  briefcase: Briefcase,
  "life-buoy": LifeBuoy,
  "eye-off": EyeOff,
  target: Target,
  users: Users,
  key: KeyRound,
  ban: Ban,
};

const SIZES = {
  xs: { box: "h-7 w-7 rounded-lg" },
  sm: { box: "h-10 w-10 rounded-xl" },
  md: { box: "h-12 w-12 rounded-2xl" },
  lg: { box: "h-16 w-16 rounded-[1.25rem]" },
  xl: { box: "h-24 w-24 rounded-[1.75rem]" },
} as const;

type AppLike = Pick<DualApp, "icon" | "color" | "name" | "logo" | "tile">;

export function AppIcon({ app, size = "md", className = "" }: { app: AppLike; size?: keyof typeof SIZES; className?: string }) {
  const s = SIZES[size];
  const style: CSSProperties = app.logo
    ? { background: app.tile ?? "#fff", boxShadow: "0 10px 30px -12px rgba(0,0,0,0.8)" }
    : {
        backgroundImage: `linear-gradient(140deg, ${app.color[0]}, ${app.color[1]})`,
        boxShadow: `0 10px 30px -10px ${app.color[1]}`,
      };

  return (
    <span
      aria-label={app.name}
      role="img"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ring-1 ring-white/15 ${s.box} ${className}`}
      style={style}
    >
      {app.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={app.logo} alt="" draggable={false} className="h-[64%] w-[64%] object-contain" />
      ) : (
        <>
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white/15" />
          {(() => {
            const Icon = APP_ICONS[app.icon];
            const iconClass = { xs: "h-3.5 w-3.5", sm: "h-5 w-5", md: "h-6 w-6", lg: "h-8 w-8", xl: "h-11 w-11" }[size];
            return <Icon className={`relative text-white drop-shadow ${iconClass}`} strokeWidth={2.2} />;
          })()}
        </>
      )}
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <defs>
          <linearGradient id="alter-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="0.55" stopColor="#e879f9" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect x="4" y="3" width="15" height="24" rx="4" fill="none" stroke="url(#alter-g1)" strokeWidth="2.4" opacity="0.55" />
        <rect x="12" y="6" width="15" height="24" rx="4" fill="url(#alter-g1)" />
        <circle cx="19.5" cy="26" r="1.4" fill="#06060c" />
      </svg>
      <span className="text-xl font-semibold tracking-tight text-white">
        alter<span className="text-fuchsia-400">.</span>
      </span>
    </span>
  );
}
