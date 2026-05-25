"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function BookingCTA() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    activity: "Quad Bikes",
    date: "",
    time: "",
    guests: 2,
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Booking failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="booking" className="bg-brand-ink text-white py-20">
      <div className="container-site text-center">
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white leading-tight">
          Ready to <span className="text-brand-yellow">Ride?</span>
        </h2>
        <p className="mt-3 text-white/80 text-[15px] sm:text-[16px] max-w-[640px] mx-auto">
          Lock in your slot in under a minute. Free cancellation, free hotel
          pickup, instant confirmation.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 max-w-[1000px] mx-auto bg-white/5 backdrop-blur rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 ring-1 ring-white/10"
        >
          <label className="text-left">
            <span className="block text-[12px] uppercase tracking-wider text-white/70 mb-1">
              Activity
            </span>
            <select
              value={form.activity}
              onChange={(e) => setForm({ ...form, activity: e.target.value })}
              className="w-full h-12 px-3 rounded-[5px] bg-white text-brand-dark text-[15px] font-medium"
            >
              <option>Quad Bikes</option>
              <option>Dune Buggy</option>
              <option>Desert Safari</option>
              <option>Water Sports</option>
              <option>City Tour</option>
            </select>
          </label>
          <label className="text-left">
            <span className="block text-[12px] uppercase tracking-wider text-white/70 mb-1">
              Date
            </span>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full h-12 px-3 rounded-[5px] bg-white text-brand-dark text-[15px] font-medium"
            />
          </label>
          <label className="text-left">
            <span className="block text-[12px] uppercase tracking-wider text-white/70 mb-1">
              Time
            </span>
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full h-12 px-3 rounded-[5px] bg-white text-brand-dark text-[15px] font-medium"
            />
          </label>
          <label className="text-left">
            <span className="block text-[12px] uppercase tracking-wider text-white/70 mb-1">
              Guests
            </span>
            <input
              type="number"
              min={1}
              max={30}
              required
              value={form.guests}
              onChange={(e) =>
                setForm({ ...form, guests: Number(e.target.value) })
              }
              className="w-full h-12 px-3 rounded-[5px] bg-white text-brand-dark text-[15px] font-medium"
            />
          </label>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="h-12 mt-[22px] sm:mt-[22px] bg-brand-yellow text-brand-dark font-extrabold text-[15px] uppercase tracking-[2px] rounded-[5px] hover:brightness-95 disabled:opacity-60"
          >
            {status === "submitting" ? "Booking…" : "Book Now"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-5 text-brand-yellow font-semibold">
            Thanks! We&apos;ve received your request and will confirm by email shortly.
          </p>
        )}
        {status === "error" && (
          <p className="mt-5 text-red-400 font-semibold">
            Something went wrong. Please try again or WhatsApp us.
          </p>
        )}
      </div>
    </section>
  );
}
