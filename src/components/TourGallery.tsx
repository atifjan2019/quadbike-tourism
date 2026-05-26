"use client";

import { useEffect, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import SmartImage from "./SmartImage";

export default function TourGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages = images.length > 0 ? images : [];
  const main = safeImages[activeIndex];

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i + 1) % safeImages.length);
      if (e.key === "ArrowLeft")
        setActiveIndex(
          (i) => (i - 1 + safeImages.length) % safeImages.length,
        );
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, safeImages.length]);

  if (safeImages.length === 0) {
    return (
      <div className="relative aspect-[16/11] rounded-md bg-black/5 border border-black/10 flex items-center justify-center text-black/30 text-sm uppercase tracking-[3px]">
        No image
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative w-full aspect-[16/11] rounded-md overflow-hidden bg-black/5 border border-black/10 block group"
          aria-label="Zoom image"
        >
          <SmartImage
            src={main}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority
          />
          <span className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-brand-dark shadow-sm border border-black/10 group-hover:bg-white">
            <Search className="w-4 h-4" />
          </span>
        </button>

        {/* Thumbnails */}
        {safeImages.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {safeImages.slice(0, 10).map((src, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`relative aspect-square rounded-md overflow-hidden bg-black/5 border-2 transition ${
                    isActive
                      ? "border-brand-dark"
                      : "border-black/10 hover:border-black/40 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <SmartImage
                    src={src}
                    alt={`${title} thumbnail ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(
                    (i) => (i - 1 + safeImages.length) % safeImages.length,
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i + 1) % safeImages.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-[1100px] aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <SmartImage
              src={main}
              alt={title}
              fill
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
