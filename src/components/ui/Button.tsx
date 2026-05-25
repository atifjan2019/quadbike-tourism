import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-yellow text-black hover:brightness-95 font-extrabold uppercase tracking-[2px]",
        secondary: "bg-black text-white hover:bg-zinc-800",
        outline: "border border-black/20 bg-transparent hover:bg-black/5 text-black",
        ghost: "hover:bg-black/5 text-black",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 px-5 text-[14px]",
        sm: "h-9 px-3 text-[13px]",
        lg: "h-14 px-6 text-[16px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { href?: string };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, ...props }, ref) => {
    const klass = cn(buttonVariants({ variant, size }), className);
    if (href) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <Link href={href} className={klass}>{props.children as any}</Link>;
    }
    return <button ref={ref} className={klass} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
export default Button;
