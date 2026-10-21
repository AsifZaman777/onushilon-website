"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange?.(false);
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export function DialogContent({ className, children, onClose, ...props }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "relative z-50 w-full max-w-[1100px] max-h-[90vh] flex flex-col overflow-hidden rounded-[26px] border border-emerald-950/80 bg-[#090d0b]/98 text-zinc-100 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in zoom-in-95 duration-200",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6 border-b border-emerald-950/60 flex items-center justify-between shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn(
        "text-lg font-bold text-white tracking-tight leading-none",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-xs text-zinc-400 mt-1.5 leading-normal", className)}
      {...props}
    />
  );
}

export function DialogBody({ className, children, ...props }) {
  return (
    <div
      className={cn("p-5 sm:p-6 flex-1 overflow-y-auto space-y-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "p-4 sm:p-5 border-t border-emerald-950/60 bg-[#060907]/60 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogClose({ onClick, className, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-xl border border-emerald-950/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all",
        className,
      )}
      {...props}
    >
      <X size={16} />
      <span className="sr-only">Close</span>
    </button>
  );
}
