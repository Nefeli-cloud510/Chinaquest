'use client';

import Link from "next/link";
import { ReactNode } from "react";
import { cx } from "./ui";
import { useLanguage } from "@/lib/language";

const navLabels = {
  home: { zh: "首页", en: "Home" },
  about: { zh: "关于", en: "About" },
  routes: { zh: "路线", en: "Routes" },
  badges: { zh: "徽章", en: "Badges" },
  admin: { zh: "管理", en: "Admin" },
  account: { zh: "账户", en: "Account" },
  guest: { zh: "访客模式（可登录管理员）", en: "Guest mode (admin login available)" },
  signIn: { zh: "登录", en: "Sign in" },
  start: { zh: "开始", en: "Start" },
  beijingCentralAxis: { zh: "北京中轴线", en: "Beijing Central Axis" },
};

function NavItem(props: {
  href: string;
  label: { zh: string; en: string };
  active?: boolean;
}) {
  const { language } = useLanguage();
  
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
      <span>{props.label[language]}</span>
      <span className="h-2 w-2 rounded-full bg-[color:var(--cq-gold)] opacity-0 group-hover:opacity-100" />
    </Link>
  );
}

function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLanguage("en")}
        className={cx(
          "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition",
          language === "en"
            ? "bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)]"
            : "bg-transparent text-[color:var(--cq-muted)] hover:bg-black/5"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("zh")}
        className={cx(
          "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition",
          language === "zh"
            ? "bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)]"
            : "bg-transparent text-[color:var(--cq-muted)] hover:bg-black/5"
        )}
      >
        中文
      </button>
    </div>
  );
}

export function SiteShell(props: {
  active: "home" | "about" | "routes" | "badges" | "admin";
  children: ReactNode;
}) {
  const userEmail: string | null = null;
  const isAdmin = false;
  const { language } = useLanguage();

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
                  {navLabels.beijingCentralAxis[language]}
                </div>
              </div>
            </Link>
            <LanguageSwitch />
          </div>

          <div className="mt-5 grid gap-2">
            <NavItem href="/" label={navLabels.home} active={props.active === "home"} />
            <NavItem href="/about/" label={navLabels.about} active={props.active === "about"} />
            <NavItem href="/routes/" label={navLabels.routes} active={props.active === "routes"} />
            <NavItem href="/badges/" label={navLabels.badges} active={props.active === "badges"} />
            {isAdmin ? <NavItem href="/admin" label={navLabels.admin} active={props.active === "admin"} /> : null}
          </div>

          <div className="mt-6 rounded-3xl bg-[color:var(--cq-ink)] p-4 text-white">
            <div className="text-sm font-semibold">{navLabels.account[language]}</div>
            <div className="mt-1 text-xs text-white/70">
              {userEmail ?? navLabels.guest[language]}
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-full bg-[color:var(--cq-gold)] px-4 text-xs font-semibold text-[color:var(--cq-ink)] hover:bg-[color:var(--cq-gold-2)]"
              >
                {navLabels.signIn[language]}
              </Link>
              <Link
                href="/routes/"
                className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-white/10 px-4 text-xs font-medium hover:bg-white/15"
              >
                {navLabels.start[language]}
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{props.children}</main>
      </div>
    </div>
  );
}
