import React, { forwardRef } from "react";
import clsx from "clsx";

type CommonProps = {
  className?: string;
  children: React.ReactNode;
};

export const GlassCard = forwardRef<HTMLDivElement, CommonProps & { hover?: boolean } & React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, hover = true, ...rest }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "relative overflow-hidden rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        hover &&
          "transition-all duration-300 hover:bg-white/[0.12] hover:border-white/[0.25] hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
GlassCard.displayName = "GlassCard";

export const GlassPanel = forwardRef<HTMLDivElement, CommonProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.16)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
GlassPanel.displayName = "GlassPanel";

export const GlassBar = forwardRef<HTMLDivElement, CommonProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] shadow-[0_10px_35px_rgba(0,0,0,0.18)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
GlassBar.displayName = "GlassBar";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export const GlassButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, variant = "primary", ...rest }, ref) => {
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-900 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/35",
      secondary:
        "bg-white/[0.1] backdrop-blur-xl border border-white/[0.2] text-white hover:bg-white/[0.15]",
      outline:
        "bg-transparent border border-white/[0.25] text-white hover:bg-white/[0.08]",
    };

    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300",
          variants[variant],
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
GlassButton.displayName = "GlassButton";

export const GlassSection = forwardRef<HTMLDivElement, CommonProps>(
  ({ className = "", children, ...rest }, ref) => (
    <section
      ref={ref}
      className={clsx(
        "relative rounded-[32px] border border-white/[0.12] bg-white/[0.04] backdrop-blur-2xl shadow-[0_16px_60px_rgba(0,0,0,0.2)] overflow-hidden",
        className
      )}
      {...rest}
    >
      {children}
    </section>
  )
);
GlassSection.displayName = "GlassSection";
























