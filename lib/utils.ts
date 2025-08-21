import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Basic input sanitizer for form data strings
export function cleanInput(value: unknown): string {
  if (typeof value !== "string") return "";
  // Trim and limit to a reasonable length to avoid abuse
  const trimmed = value.trim();
  return trimmed.length > 50000 ? trimmed.slice(0, 50000) : trimmed;
}

// GUID/UUID generator with crypto fallback
export function guidGenerator(): string {
  try {
    const g: any = globalThis as any;
    if (g && g.crypto && typeof g.crypto.randomUUID === "function") {
      return g.crypto.randomUUID();
    }
  } catch (_) {}
  const random = Math.random().toString(16).slice(2);
  const time = Date.now().toString(16);
  return `id-${time}-${random}`;
}
