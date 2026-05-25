import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline";

type Props = {
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({
  href,
  variant = "primary",
  className = "",
  children,
  onClick,
  type = "button",
}: Props) {
  const klass = `${variant === "primary" ? "btn-primary" : "btn-outline"} ${className}`.trim();
  if (href) {
    return (
      <Link href={href} className={klass}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={klass}>
      {children}
    </button>
  );
}
