"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, MessageCircle, X } from "lucide-react";

export type BookingVariation = {
  id: string;
  label: string;
  price: number;
  durationMin: number | null;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function BookingPanel({
  tourSlug,
  tourTitle,
  priceFrom,
  variations,
  whatsapp,
}: {
  tourSlug: string;
  tourTitle: string;
  priceFrom: number;
  variations: BookingVariation[];
  whatsapp?: string;
}) {
  const [bookingDate, setBookingDate] = useState("");
  const [selectedVarId, setSelectedVarId] = useState<string | null>(
    variations[0]?.id ?? null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    bookingTime: "",
    guests: 1,
    notes: "",
  });

  const selectedVariation = useMemo(
    () => variations.find((v) => v.id === selectedVarId) ?? null,
    [variations, selectedVarId],
  );

  const unitPrice = selectedVariation ? selectedVariation.price : priceFrom;
  const total = unitPrice * form.guests;

  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const today = new Date().toISOString().slice(0, 10);

  function openModal() {
    setStatus("idle");
    setErrorMsg(null);
    setReference(null);
    setModalOpen(true);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug,
          variationId: selectedVarId ?? undefined,
          bookingDate,
          bookingTime: form.bookingTime,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          guests: form.guests,
          notes: form.notes,
        }),
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

  return (
    <>
      {/* Compact booking panel */}
      <div className="bg-white border border-black/10 rounded-md p-5 sm:p-6 space-y-5 shadow-sm">
        <div>
          <label className="block text-[14px] font-bold text-brand-dark mb-2">
            Booking Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={bookingDate}
              min={today}
              onChange={(e) => setBookingDate(e.target.value)}
              placeholder="Click here for Booking Date"
              className="w-full h-11 px-3 pr-10 border border-black/15 rounded-md bg-white text-[14px] text-brand-dark outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-yellow/40"
            />
            <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
          </div>
        </div>

        {variations.length > 0 && (
          <div>
            <label className="block text-[14px] font-bold text-brand-dark mb-2">
              Select Tour <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {variations.map((v) => {
                const isSelected = v.id === selectedVarId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVarId(v.id)}
                    className={`px-4 h-10 rounded-md text-[13px] font-bold border-2 transition ${
                      isSelected
                        ? "bg-brand-yellow border-brand-dark text-brand-dark"
                        : "bg-white border-black/15 text-brand-dark/80 hover:border-brand-dark/40"
                    }`}
                  >
                    {v.label} (+AED {v.price.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-black/10">
          <span className="text-[18px] font-extrabold text-brand-dark">
            Grand total
          </span>
          <span className="text-[22px] font-extrabold text-brand-dark">
            AED {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="w-full h-12 bg-brand-dark text-white rounded-md font-extrabold text-[14px] uppercase tracking-[2px] hover:bg-black transition"
        >
          Book Now
        </button>

        {whatsapp && (
          <a
            href={`https://api.whatsapp.com/send?phone=${whatsapp}&text=Hi%2C+I%27m+interested+in+${encodeURIComponent(
              tourTitle,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] text-white rounded-md font-bold text-[13px] h-12 hover:brightness-95 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Booking &amp; Information</span>
          </a>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-black/10 sticky top-0 bg-white z-10">
              <div>
                <p className="text-[11px] uppercase tracking-[3px] font-extrabold text-brand-orange">
                  Confirm your booking
                </p>
                <h3 className="mt-1 text-[20px] font-extrabold text-brand-dark leading-tight">
                  {tourTitle}
                </h3>
                {selectedVariation && (
                  <p className="mt-1 text-[13px] text-black/60 font-semibold">
                    {selectedVariation.label} · AED {unitPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setModalOpen(false)}
                className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md text-black/60 hover:text-black hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {status === "success" ? (
              <div className="p-6 text-center">
                <p className="text-[12px] uppercase tracking-[3px] font-extrabold text-brand-orange">
                  Request received
                </p>
                <h4 className="mt-2 text-[22px] font-extrabold text-brand-dark">
                  Thanks — we&apos;ll confirm shortly!
                </h4>
                <p className="mt-3 text-[14px] text-black/70">
                  Your booking for{" "}
                  <span className="font-bold">{tourTitle}</span> is in our
                  queue.
                  {reference && (
                    <>
                      {" "}Reference:{" "}
                      <span className="font-mono font-bold text-brand-dark">
                        {reference}
                      </span>
                    </>
                  )}
                </p>
                {whatsapp && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=${whatsapp}&text=Hi%2C+I+just+booked+${encodeURIComponent(
                      tourTitle,
                    )}${reference ? `+(ref+${reference})` : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center bg-brand-dark text-white px-6 h-11 rounded-md font-extrabold text-[13px] uppercase tracking-[2px] hover:bg-black"
                  >
                    Confirm on WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mt-3 w-full h-11 border border-black/15 rounded-md text-[13px] font-bold text-black/70 hover:bg-black/5"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-5 sm:p-6 space-y-4">
                <ModalField label="Full Name" required>
                  <input
                    required
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    className="modal-input"
                    placeholder="John Doe"
                  />
                </ModalField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ModalField label="Phone / WhatsApp" required>
                    <input
                      required
                      value={form.customerPhone}
                      onChange={(e) =>
                        setForm({ ...form, customerPhone: e.target.value })
                      }
                      className="modal-input"
                      placeholder="+971 ..."
                    />
                  </ModalField>
                  <ModalField label="Email" required>
                    <input
                      required
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) =>
                        setForm({ ...form, customerEmail: e.target.value })
                      }
                      className="modal-input"
                      placeholder="you@example.com"
                    />
                  </ModalField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ModalField label="Booking Date" required>
                    <input
                      required
                      type="date"
                      value={bookingDate}
                      min={today}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="modal-input"
                    />
                  </ModalField>
                  <ModalField label="Preferred Time">
                    <input
                      type="time"
                      value={form.bookingTime}
                      onChange={(e) =>
                        setForm({ ...form, bookingTime: e.target.value })
                      }
                      className="modal-input"
                    />
                  </ModalField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {variations.length > 0 && (
                    <ModalField label="Tour Duration" required>
                      <select
                        required
                        value={selectedVarId ?? ""}
                        onChange={(e) => setSelectedVarId(e.target.value)}
                        className="modal-input"
                      >
                        {variations.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.label} (AED {v.price.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </ModalField>
                  )}
                  <ModalField label="Number of Riders" required>
                    <input
                      required
                      type="number"
                      min={1}
                      max={30}
                      value={form.guests}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          guests: Math.max(1, Number(e.target.value || 1)),
                        })
                      }
                      className="modal-input"
                    />
                  </ModalField>
                </div>

                <ModalField label="Special Requests">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    className="modal-input"
                    placeholder="Pickup location, dietary needs, anything else…"
                  />
                </ModalField>

                <div className="flex items-center justify-between gap-4 pt-3 border-t border-black/10">
                  <div>
                    <p className="text-[11px] uppercase tracking-[2px] text-black/55 font-bold">
                      Estimated total
                    </p>
                    <p className="text-[22px] font-extrabold text-brand-dark leading-none">
                      AED {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="bg-brand-yellow text-brand-dark px-6 h-12 rounded-md font-extrabold text-[13px] uppercase tracking-[2px] border-2 border-brand-dark hover:brightness-95 disabled:opacity-60"
                  >
                    {status === "submitting" ? "Booking…" : "Confirm Booking"}
                  </button>
                </div>

                {status === "error" && (
                  <p className="text-[13px] text-red-600 font-semibold">
                    {errorMsg ?? "Something went wrong. Please try again."}
                  </p>
                )}

                <style>{`.modal-input{width:100%;height:44px;padding:0 12px;border:1px solid rgba(0,0,0,0.15);border-radius:6px;background:#fff;color:#000;font-size:14px;font-weight:500;outline:none}.modal-input:focus{border-color:#000;box-shadow:0 0 0 3px rgba(247,200,59,0.35)}textarea.modal-input{height:auto;padding-top:10px;padding-bottom:10px;resize:vertical}select.modal-input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23000' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}`}</style>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ModalField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-bold text-brand-dark mb-1.5">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
