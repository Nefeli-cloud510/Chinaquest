import Link from "next/link";
import { ReactNode } from "react";

export function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export function Card(props: {
  className?: string;
  children: ReactNode;
  tone?: "surface" | "ink";
}) {
  const tone = props.tone ?? "surface";
  return (
    <div
      className={cx(
        "rounded-3xl border px-6 py-5 shadow-[0_12px_32px_var(--cq-shadow)]",
        "border-[color:var(--cq-border)]",
        tone === "surface" && "bg-[color:var(--cq-surface)]",
        tone === "ink" && "bg-[color:var(--cq-ink)] text-white border-white/10",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

export function Button(props: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  type?: "button" | "submit";
}) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const base = cx(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium",
    "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cq-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cq-bg)]",
    size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-5 text-sm",
    variant === "primary" &&
      "bg-[color:var(--cq-ink)] text-white hover:bg-black/85",
    variant === "secondary" &&
      "bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] hover:bg-[color:var(--cq-gold-2)]",
    variant === "ghost" &&
      "border border-[color:var(--cq-border)] bg-transparent hover:bg-black/5",
    props.className,
  );

  if (props.href) {
    return (
      <Link className={base} href={props.href}>
        {props.children}
      </Link>
    );
  }

  return (
    <button className={base} type={props.type ?? "button"} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export function Pill(props: {
  children: ReactNode;
  tone?: "red" | "gold" | "neutral";
  className?: string;
}) {
  const tone = props.tone ?? "neutral";
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "neutral" && "bg-black/5 text-[color:var(--cq-muted)]",
        tone === "red" && "bg-[color:var(--cq-red)] text-white",
        tone === "gold" && "bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)]",
        props.className,
      )}
    >
      {props.children}
    </span>
  );
}

export function Field(props: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--cq-muted)]">
        {props.label}
      </span>
      <input
        className={cx(
          "h-11 rounded-2xl border bg-[color:var(--cq-surface-2)] px-4 text-sm",
          "border-[color:var(--cq-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cq-gold)]",
        )}
        name={props.name}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
      />
    </label>
  );
}
