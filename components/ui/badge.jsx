import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  default: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  secondary: "bg-zinc-900 text-zinc-300 border-zinc-800",
  destructive: "bg-rose-950/60 text-rose-300 border-rose-800/60",
  outline: "text-zinc-300 border-zinc-700 bg-transparent",
  success: "bg-emerald-950/80 text-emerald-300 border-emerald-600/50 font-semibold",
  warning: "bg-amber-950/60 text-amber-300 border-amber-800/60",
  cyan: "bg-teal-950/60 text-teal-300 border-teal-800/60",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}

