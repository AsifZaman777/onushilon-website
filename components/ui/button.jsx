import React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  default: "bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20 active:scale-[0.98]",
  destructive: "bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 shadow-md shadow-rose-950/30 active:scale-[0.98]",
  outline: "border border-emerald-500/25 bg-[#080d0a]/70 hover:bg-emerald-950/40 text-emerald-300 hover:border-emerald-500/50 active:scale-[0.98]",
  secondary: "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-[0.98]",
  ghost: "hover:bg-zinc-900/80 text-zinc-400 hover:text-white",
  link: "text-emerald-400 underline-offset-4 hover:underline",
  success: "bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20 active:scale-[0.98]",
};

const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 rounded-lg px-3 text-xs",
  lg: "h-12 rounded-xl px-6 text-base font-semibold",
  icon: "h-9 w-9 rounded-xl p-0 flex items-center justify-center",
};

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant] || buttonVariants.default,
          buttonSizes[size] || buttonSizes.default,
          className
        )}
        {...props}
      />
    );
  }
);


Button.displayName = "Button";
