"use client";

import { BatteryFull, SignalHigh, Wifi } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const now = useClock();
  const time = now ? now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "09:41";
  return (
    <div
      className={`relative mx-auto aspect-[9/19] w-full max-w-[300px] rounded-[3rem] bg-gradient-to-b from-zinc-700 via-zinc-900 to-zinc-800 p-[10px] shadow-[0_40px_120px_-30px_rgba(139,92,246,0.55),0_0_0_1px_rgba(255,255,255,0.08)] ${className}`}
    >
      <div className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l bg-zinc-700" />
      <div className="absolute -left-[3px] top-44 h-12 w-[3px] rounded-l bg-zinc-700" />
      <div className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-zinc-700" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-[#07070f]">
        <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(139,92,246,0.45),transparent_60%),radial-gradient(90%_60%_at_100%_100%,rgba(34,211,238,0.25),transparent_60%)]" />
        <div className="relative z-20 flex items-center justify-between px-7 pt-3.5 text-[11px] font-semibold text-white">
          <span suppressHydrationWarning>{time}</span>
          <span className="flex items-center gap-1">
            <SignalHigh className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-4 w-4" />
          </span>
        </div>
        <div className="absolute left-1/2 top-2.5 z-30 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
        <div className="relative z-10 h-[calc(100%-2rem)]">{children}</div>
      </div>
    </div>
  );
}
