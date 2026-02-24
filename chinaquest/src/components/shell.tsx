import Link from "next/link";
import { ReactNode } from "react";
import { cx } from "./ui";

function NavItem(props: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={props.href}
      className={cx(
        "group flex h-11 items-center justify-between rounded-2xl px-4 text-sm font-medium transition",
        props.active
          ? "bg-[color:var(--cq-ink)] text-white"
          : "text-[color:var(--cq-muted)] hover:bg-black/5 hover:text-[color:var(--cq-text)]",
      )}
    >
      <span>{props.label}</span>
      <span className="h-2 w-2 rounded-full bg-[color:var(--cq-gold)] opacity-0 group-hover:opacity-100" />
    </Link>
  );
}

export async function SiteShell(props: {
  active: "home" | "about" | "routes" | "badges" | "admin";
  children: ReactNode;
}) {
  const user = null;
  const isAdmin = false;

  return (
    <div className="min-h-dvh bg-[color:var(--cq-bg)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:px-6">
        <aside className="rounded-3xl border bg-[color:var(--cq-surface)] p-4 shadow-[0_12px_32px_var(--cq-shadow)] border-[color:var(--cq-border)]">
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--cq-ink)] text-[color:var(--cq-gold)] font-semibold">
                CQ
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[color:var(--cq-text)]">
                  ChinaQuest
                </div>
                <div className="text-xs text-[color:var(--cq-muted)]">
                  Beijing Central Axis
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-5 grid gap-2">
            <NavItem href="/" label="Home" active={props.active === "home"} />
            <NavItem href="/about" label="About" active={props.active === "about"} />
            <NavItem href="/routes" label="Routes" active={props.active === "routes"} />
            <NavItem href="/badges" label="Badges" active={props.active === "badges"} />
            {isAdmin ? <NavItem href="/admin" label="Admin" active={props.active === "admin"} /> : null}
          </div>

          <div className="mt-6 rounded-3xl bg-[color:var(--cq-ink)] p-4 text-white">
            <div className="text-sm font-semibold">Account</div>
            <div className="mt-1 text-xs text-white/70">
              {user ? user.email : "Guest mode (admin login available)"}
            </div>
            <div className="mt-4 flex gap-2">
              {user ? (
                <Link
                  href="/api/auth/logout"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-white/10 px-4 text-xs font-medium hover:bg-white/15"
                >
                  Sign out
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-[color:var(--cq-gold)] px-4 text-xs font-semibold text-[color:var(--cq-ink)] hover:bg-[color:var(--cq-gold-2)]"
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/routes"
                className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-white/10 px-4 text-xs font-medium hover:bg-white/15"
              >
                Start
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{props.children}</main>
      </div>
    </div>
  );
}
