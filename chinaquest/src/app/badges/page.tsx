import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { getContent } from "@/lib/content";
import { getOrCreateUserIdentity } from "@/lib/identity";
import { listRunsForUser } from "@/lib/run";

export default async function BadgesPage() {
  const content = await getContent();
  const { userId } = await getOrCreateUserIdentity();
  const runs = await listRunsForUser(userId);
  const earned = new Set(runs.flatMap((r) => r.earnedBadgeIds));

  return (
    <SiteShell active="badges">
      <div className="grid gap-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Badges</h1>
              <p className="mt-2 text-sm text-[color:var(--cq-muted)]">
                Earn a badge for each solved stop. Complete the full route to unlock the finale badge.
              </p>
            </div>
            <Button href="/routes" variant="secondary">
              Start a route
            </Button>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {content.badges.map((b) => (
            <Card key={b.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={b.color === "gold" ? "gold" : b.color === "red" ? "red" : "neutral"}>
                    {earned.has(b.id) ? "Unlocked" : "Locked"}
                  </Pill>
                  <Pill>{b.id}</Pill>
                </div>
                {earned.has(b.id) ? <Pill tone="gold">★</Pill> : <Pill>☆</Pill>}
              </div>
              <div className="mt-3 text-lg font-semibold">{b.title.en}</div>
              <div className="mt-1 text-sm text-[color:var(--cq-muted)]">{b.desc.en}</div>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
