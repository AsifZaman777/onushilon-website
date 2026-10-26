import React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  default: "bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md  active:scale-[0.98]",
  destructive: "bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 shadow-md  active:scale-[0.98]",
  outline: "border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 hover:border-blue-300 active:scale-[0.98]",
  secondary: "bg-slate-100 hover:bg-slate-100 text-slate-900 border border-slate-200 active:scale-[0.98]",
  ghost: "hover:bg-slate-100 text-slate-500 hover:text-slate-900",
  link: "text-blue-700 underline-offset-4 hover:underline",
  success: "bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md  active:scale-[0.98]",
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
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
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
