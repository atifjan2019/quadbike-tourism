"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin/dashboard";
  const [passcode, setPasscode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-lg border border-black/10 bg-white shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/uploads/buggy-desert-1.png"
            alt="Quad Bike Tourism"
            width={200}
            height={90}
            priority
            className="h-20 w-auto object-contain"
          />
        </div>
        <h1 className="text-2xl font-extrabold text-black text-center">Admin passcode</h1>
        <p className="mt-1 text-sm text-black/60 text-center">
          Enter the passcode to view saved bookings.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="passcode"
              className="block text-sm font-bold text-black"
            >
              Passcode
            </label>
            <input
              id="passcode"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              autoFocus
              value={passcode}
              onChange={(e) => {
                setErr(null);
                setPasscode(e.target.value);
              }}
              className="block w-full h-11 px-3 rounded-md border-2 border-black/20 bg-white text-black text-[15px] focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/30"
            />
          </div>

          {err && (
            <p className="text-sm text-red-600 font-semibold">{err}</p>
          )}

          <button
            type="submit"
            disabled={busy || !passcode}
            className="w-full h-12 rounded-md bg-brand-yellow hover:brightness-95 text-black font-extrabold uppercase tracking-[2px] text-[14px] transition disabled:opacity-50"
          >
            {busy ? "Unlocking…" : "Unlock bookings"}
          </button>
        </form>
      </div>
    </div>
  );
}
