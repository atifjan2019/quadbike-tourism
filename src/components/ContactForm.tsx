"use client";

import { useState } from "react";

const TOPICS = [
  "General enquiry",
  "Booking a tour",
  "Group / corporate enquiry",
  "Custom itinerary",
  "Refund / reschedule",
  "Press / partnership",
];

const MAX_MSG = 600;

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    topic: "",
    phone: "",
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.topic) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ topic: "", phone: "", name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-brand-yellow/20 rounded-lg p-6 sm:p-8 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm text-black/70 mb-1">Select one</span>
          <select
            value={form.topic}
            onChange={(e) => set("topic", e.target.value)}
            required
            className="w-full h-12 px-3 rounded-md bg-white text-[15px] text-black border border-transparent focus:border-black/30 outline-none"
          >
            <option value="">Please Select One</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm text-black/70 mb-1">Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Phone Number"
            required
            className="w-full h-12 px-3 rounded-md bg-white text-[15px] text-black border border-transparent focus:border-black/30 outline-none"
          />
        </label>
        <label className="block">
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Name"
            required
            className="w-full h-12 px-3 rounded-md bg-white text-[15px] text-black border border-transparent focus:border-black/30 outline-none"
          />
        </label>
        <label className="block">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="Email"
            required
            className="w-full h-12 px-3 rounded-md bg-white text-[15px] text-black border border-transparent focus:border-black/30 outline-none"
          />
        </label>
      </div>

      <label className="block">
        <input
          type="text"
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          placeholder="Subject"
          required
          className="w-full h-12 px-3 rounded-md bg-white text-[15px] text-black border border-transparent focus:border-black/30 outline-none"
        />
      </label>

      <label className="block">
        <textarea
          value={form.message}
          onChange={(e) =>
            set("message", e.target.value.slice(0, MAX_MSG))
          }
          rows={6}
          placeholder="Type Message"
          required
          className="w-full px-3 py-3 rounded-md bg-white text-[15px] text-black border border-transparent focus:border-black/30 outline-none resize-y"
        />
        <div className="text-right text-xs text-black/50 mt-1">
          {form.message.length} of {MAX_MSG}
        </div>
      </label>

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-brand-ink text-white font-extrabold text-[15px] uppercase tracking-[2px] px-8 h-12 rounded-md hover:opacity-90 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>
      </div>

      {status === "success" && (
        <p className="text-emerald-700 font-semibold">
          Thanks! We&apos;ve received your message and will reply shortly.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-semibold">
          Something went wrong. Please try again or WhatsApp us.
        </p>
      )}
    </form>
  );
}
