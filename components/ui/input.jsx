import React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[46px] w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-[0.95rem] text-slate-900 placeholder:text-slate-400 shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-[0.95rem] text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export function Label({ className, children, required, ...props }) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5",
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="text-blue-700 ml-1 font-bold">*</span>}
    </label>
  );
}
