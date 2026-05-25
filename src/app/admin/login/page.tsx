"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Delete } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin/dashboard";
  const [passcode, setPasscode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const press = (d: string) => {
    if (passcode.length >= 12) return;
    setErr(null);
    setPasscode((p) => p + d);
  };
  const back = () => {
    setErr(null);
    setPasscode((p) => p.slice(0, -1));
  };

  async function submit() {
    if (!passcode) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Wrong passcode");
        setPasscode("");
      } else {
        router.replace(from);
      }
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-ink p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <p className="font-display text-2xl text-brand-yellow leading-none">QB</p>
          <h1 className="mt-3 text-2xl font-extrabold text-black">Admin Access</h1>
          <p className="mt-1 text-sm text-black/60">Enter the 6-digit passcode</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mb-6 h-6">
          {Array.from({ length: Math.max(6, passcode.length) }).map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < passcode.length ? "bg-black" : "bg-black/15"
              }`}
            />
          ))}
        </div>

        {err && (
          <p className="text-center text-red-600 text-sm font-semibold mb-3">{err}</p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button
              key={d}
              onClick={() => press(d)}
              className="h-14 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black text-xl font-bold transition"
            >
              {d}
            </button>
          ))}
          <button
            onClick={back}
            aria-label="Backspace"
            className="h-14 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black inline-flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => press("0")}
            className="h-14 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black text-xl font-bold"
          >
            0
          </button>
          <button
            onClick={submit}
            disabled={busy || !passcode}
            className="h-14 rounded-xl bg-brand-yellow text-black font-extrabold uppercase tracking-wider hover:brightness-95 disabled:opacity-50"
          >
            {busy ? "…" : "Enter"}
          </button>
        </div>
      </div>
    </div>
  );
}
