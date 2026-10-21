import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-950/70 bg-[#090f0d]/90 text-zinc-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all hover:border-emerald-800/60 hover:shadow-[0_20px_48px_rgba(0,0,0,0.42)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6 border-b border-emerald-950/50 flex flex-col space-y-1.5",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-base font-bold text-white tracking-tight leading-none",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs text-zinc-400 mt-1 leading-normal", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6 border-t border-emerald-950/50 flex items-center",
        className,
      )}
      {...props}
    />
  );
}
