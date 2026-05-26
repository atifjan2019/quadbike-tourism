"use client";

import { useState } from "react";
import { Calendar, Clock, Users, Phone, Mail, User as UserIcon } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function TourBookingForm({
  tourSlug,
  tourTitle,
  priceFrom,
  whatsapp,
}: {
  tourSlug: string;
  tourTitle: string;
  priceFrom: number;
  whatsapp?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    bookingDate: "",
    bookingTime: "",
    guests: 2,
    notes: "",
  });

  const total = priceFrom * form.guests;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tourSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Booking failed");
      setReference(data.reference ?? null);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Booking failed");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-brand-cream border-2 border-brand-dark rounded-lg p-6 text-center">
        <p className="text-[12px] uppercase tracking-[3px] font-extrabold text-brand-orange">
          Request received
        </p>
        <h3 className="mt-2 text-[24px] font-extrabold text-brand-dark">
          Thanks — we&apos;ll confirm shortly!
        </h3>
        <p className="mt-3 text-[14px] text-black/70">
          Your booking for <span className="font-bold">{tourTitle}</span> is in our queue.
          {reference && (
            <>
              {" "}Reference:{" "}
              <span className="font-mono font-bold text-brand-dark">{reference}</span>
            </>
          )}
        </p>
        {whatsapp && (
          <a
            href={`https://api.whatsapp.com/send?phone=${whatsapp}&text=Hi%2C+I+just+booked+${encodeURIComponent(
              tourTitle,
            )}+${reference ? `(ref+${reference})` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center bg-brand-dark text-white px-6 h-11 rounded-md font-extrabold text-[13px] uppercase tracking-[2px] hover:bg-black"
          >
            Confirm on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border-2 border-brand-dark rounded-lg p-5 sm:p-6 space-y-4"
    >
      <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[3px] font-extrabold text-brand-orange">
            Book this tour
          </p>
          <p className="text-[20px] font-extrabold text-brand-dark leading-tight">
            From AED {priceFrom.toLocaleString()}{" "}
            <span className="text-[13px] font-medium text-black/60">/ person</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field icon={<UserIcon className="w-4 h-4" />} label="Your name">
          <input
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="input"
            placeholder="John Doe"
          />
        </Field>
        <Field icon={<Mail className="w-4 h-4" />} label="Email">
          <input
            required
            type="email"
            value={form.customerEmail}
            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            className="input"
            placeholder="you@example.com"
          />
        </Field>
        <Field icon={<Phone className="w-4 h-4" />} label="Phone / WhatsApp">
          <input
            required
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            className="input"
            placeholder="+971 ..."
          />
        </Field>
        <Field icon={<Users className="w-4 h-4" />} label="Guests">
          <input
            required
            type="number"
            min={1}
            max={30}
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: Math.max(1, Number(e.target.value || 1)) })}
            className="input"
          />
        </Field>
        <Field icon={<Calendar className="w-4 h-4" />} label="Date">
          <input
            required
            type="date"
            value={form.bookingDate}
            onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
            className="input"
            min={new Date().toISOString().slice(0, 10)}
          />
        </Field>
        <Field icon={<Clock className="w-4 h-4" />} label="Time">
          <input
            required
            type="time"
            value={form.bookingTime}
            onChange={(e) => setForm({ ...form, bookingTime: e.target.value })}
            className="input"
          />
        </Field>
      </div>

      <Field label="Notes (optional)">
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="input"
          placeholder="Pickup location, group size, anything else…"
        />
      </Field>

      <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-[2px] text-black/55 font-bold">Estimated total</p>
          <p className="text-[24px] font-extrabold text-brand-dark leading-none">
            AED {total.toLocaleString()}
          </p>
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-brand-yellow text-brand-dark px-6 h-12 rounded-md font-extrabold text-[14px] uppercase tracking-[2px] border-2 border-brand-dark hover:brightness-95 disabled:opacity-60"
        >
          {status === "submitting" ? "Booking…" : "Confirm Booking"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-[13px] text-red-600 font-semibold">
          {errorMsg ?? "Something went wrong. Please try again."}
        </p>
      )}

      <style>{`.input{width:100%;height:44px;padding:0 12px;border:1px solid rgba(0,0,0,0.15);border-radius:6px;background:#fff;color:#000;font-size:14px;font-weight:500;outline:none}.input:focus{border-color:#000;box-shadow:0 0 0 3px rgba(247,200,59,0.35)}textarea.input{height:auto;padding-top:10px;padding-bottom:10px}`}</style>
    </form>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-left">
      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-black/60 font-bold mb-1">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
