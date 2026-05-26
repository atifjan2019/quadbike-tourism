import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-brand-cream/40 border-b border-black/5"
    >
      <ol className="container-site py-3 text-[12px] sm:text-[13px] uppercase tracking-[2px] text-black/60 font-bold flex items-center justify-center sm:justify-start gap-2 flex-wrap">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3 opacity-50" />}
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-brand-dark">
                  {c.label}
                </Link>
              ) : (
                <span className={isLast ? "text-brand-dark" : ""}>{c.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
