import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm backdrop-blur-md transition-all hover:border-emerald-800/60 hover:shadow-sm",
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
        "p-5 sm:p-6 border-b border-slate-200 flex flex-col space-y-1.5",
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
        "text-base font-bold text-slate-900 tracking-tight leading-none",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs text-slate-500 mt-1 leading-normal", className)}
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
        "p-5 sm:p-6 border-t border-slate-200 flex items-center",
        className,
      )}
      {...props}
    />
  );
}
