import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = ({ className, ...p }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto rounded-lg border border-black/10 bg-white">
    <table className={cn("w-full text-left text-[14px]", className)} {...p} />
  </div>
);
export const THead = ({ className, ...p }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-zinc-50 border-b border-black/10", className)} {...p} />
);
export const TBody = ({ className, ...p }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("divide-y divide-black/10", className)} {...p} />
);
export const TR = ({ className, ...p }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("hover:bg-zinc-50", className)} {...p} />
);
export const TH = ({ className, ...p }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn("px-4 py-3 font-bold uppercase tracking-wider text-[11px] text-black/70", className)}
    {...p}
  />
);
export const TD = ({ className, ...p }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-3 text-black align-middle", className)} {...p} />
);
