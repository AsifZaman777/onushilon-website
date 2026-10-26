import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  default: "bg-blue-50 text-blue-700 border-blue-200",
  secondary: "bg-slate-100 text-slate-700 border-slate-200",
  destructive: "bg-rose-50 text-rose-600 border-rose-200",
  outline: "text-slate-700 border-slate-300 bg-transparent",
  success: "bg-blue-50 text-blue-700 border-emerald-600/50 font-semibold",
  warning: "bg-amber-950/60 text-amber-300 border-amber-800/60",
  cyan: "bg-teal-950/60 text-teal-300 border-teal-800/60",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}

