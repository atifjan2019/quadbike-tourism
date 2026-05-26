"use client";

import { useState } from "react";
import { X } from "lucide-react";

const PHONE = "971500000000";
const AGENT = "Quad Bike Tourism";
const DEFAULT_MSG =
  "Hi Quad Bike Tourism, I'd like to book a tour. Could you help me?";

function WhatsAppGlyph({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${className} fill-current`}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MSG);

  const href = `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(
    message || DEFAULT_MSG,
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat popup */}
      {open && (
        <div className="w-[320px] sm:w-[340px] bg-white rounded-xl shadow-2xl border border-black/10 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white text-[#075E54] flex items-center justify-center font-extrabold text-[14px]">
                QB
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-extrabold leading-tight truncate">
                {AGENT}
              </p>
              <p className="text-[11px] opacity-90 leading-tight">Online</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div
            className="px-4 py-5 space-y-3"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
              backgroundColor: "#ECE5DD",
            }}
          >
            <div className="bg-white rounded-md px-3 py-2 shadow-sm max-w-[80%]">
              <p className="text-[11px] font-bold text-[#075E54]">
                {AGENT}
              </p>
              <p className="text-[13px] text-black/80 mt-0.5">
                Hi there 👋 How can we help you plan your desert adventure?
              </p>
              <p className="text-[10px] text-black/40 text-right mt-1">
                Typically replies in a few minutes
              </p>
            </div>
          </div>

          {/* Composer */}
          <div className="bg-white p-3 border-t border-black/10">
            <p className="text-[11px] uppercase tracking-[1.5px] font-bold text-black/55 mb-2">
              Start a Conversation
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-black/15 rounded-md text-[13px] resize-none outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/30"
              placeholder="Write a message…"
            />
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 h-11 rounded-md bg-[#25D366] text-white font-extrabold text-[13px] uppercase tracking-[2px] hover:brightness-95"
            >
              <WhatsAppGlyph className="w-4 h-4" />
              Send on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="w-7 h-7" /> : <WhatsAppGlyph className="w-8 h-8" />}
      </button>
    </div>
  );
}
