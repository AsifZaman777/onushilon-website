import React from "react";
import { cn } from "../../lib/utils";

export function TabsList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex w-full flex-wrap items-center gap-1.5 rounded-2xl bg-slate-50/90 border border-slate-200 p-1.5 text-slate-500 overflow-x-auto max-w-full",
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
        "inline-flex flex-1 min-w-[120px] items-center justify-center whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-blue-600 text-white font-bold shadow-md "
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
