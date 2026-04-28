"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { withBasePath } from "@/lib/base-path";
import { staticContent } from "@/lib/static-content";
import { useLanguage } from "@/lib/language";

const BADGE_STORAGE_KEY = "cq_badges_v1";
const REQUIRED_STOP_BADGES = ["badge_axis_gatekeeper", "badge_axis_timekeeper", "badge_axis_modern_weaver"];
const FINALE_BADGE_ID = "badge_axis_complete";

const pageLabels = {
  title: { zh: "徽章", en: "Badges" },
  description: { 
    zh: "每完成一个站点任务获得一枚徽章。完成完整路线解锁终章徽章。", 
    en: "Earn a badge for each solved stop. Complete the full route to unlock the finale badge." 
  },
  startRoute: { zh: "开始路线", en: "Start a route" },
  badge: { zh: "徽章", en: "Badge" },
  unlocked: { zh: "已解锁", en: "Unlocked" },
  locked: { zh: "未解锁", en: "Locked" },
};

function readEarnedBadges(): string[] {
  try {
    const raw = window.localStorage.getItem(BADGE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function writeEarnedBadges(badges: string[]) {
  try {
    window.localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(badges));
  } catch {
    return;
  }
}

export default function BadgesPage() {
  const content = staticContent;
  const [earned, setEarned] = useState<string[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    const cur = readEarnedBadges();
    const hasAllStops = REQUIRED_STOP_BADGES.every((id) => cur.includes(id));
    const next = hasAllStops ? Array.from(new Set([...cur, FINALE_BADGE_ID])) : cur;
    if (next.length !== cur.length) writeEarnedBadges(next);
    setEarned(next);
  }, []);

  const orderedBadges = useMemo(() => {
    const finale = content.badges.find((b) => b.id === FINALE_BADGE_ID);
    const rest = content.badges.filter((b) => b.id !== FINALE_BADGE_ID);
    return [...rest, ...(finale ? [finale] : [])];
  }, [content.badges]);

  return (
    <SiteShell active="badges">
      <div className="grid gap-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{pageLabels.title[language]}</h1>
              <p className="mt-2 text-sm text-[color:var(--cq-muted)]">
                {pageLabels.description[language]}
              </p>
            </div>
            <Button href="/routes/" variant="secondary">
              {pageLabels.startRoute[language]}
            </Button>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {orderedBadges.map((b) => {
            const unlocked = earned.includes(b.id);
            const locked = !unlocked;
            return (
            <Card key={b.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={b.color === "gold" ? "gold" : b.color === "red" ? "red" : "neutral"}>
                    {pageLabels.badge[language]}
                  </Pill>
                  <Pill>{b.id}</Pill>
                </div>
                <Pill>{unlocked ? pageLabels.unlocked[language] : pageLabels.locked[language]}</Pill>
              </div>
              {b.image ? (
                <div className="mt-4 rounded-2xl border border-[color:var(--cq-border)] bg-[color:var(--cq-surface-2)] p-4">
                  <img
                    src={withBasePath(`/${b.image}`)}
                    alt={b.title[language]}
                    className={[
                      "mx-auto h-44 w-44 object-contain",
                      locked ? "opacity-40 grayscale" : "",
                    ].join(" ")}
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="mt-3 text-lg font-semibold">{b.title[language]}</div>
              <div className="mt-1 text-sm text-[color:var(--cq-muted)]">{b.desc[language]}</div>
            </Card>
          )})}
        </div>
      </div>
    </SiteShell>
  );
}
