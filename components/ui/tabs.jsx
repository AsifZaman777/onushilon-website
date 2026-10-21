import React from "react";
import { cn } from "../../lib/utils";

export function TabsList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex w-full flex-wrap items-center gap-1.5 rounded-2xl bg-[#060a08]/90 border border-emerald-950/70 p-1.5 text-zinc-400 overflow-x-auto max-w-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  active,
  onClick,
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 min-w-[120px] items-center justify-center whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/25"
          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
