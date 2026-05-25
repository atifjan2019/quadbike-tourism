"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
};

export function Switch({ checked, onCheckedChange, className, disabled, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 disabled:opacity-50",
        checked ? "bg-brand-yellow" : "bg-zinc-300",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
export default Switch;
