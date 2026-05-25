import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number | string, currency = "AED") {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return `${currency} ${n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function generateBookingReference() {
  const year = new Date().getFullYear();
  const n = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `QBT-${year}-${n}`;
}
