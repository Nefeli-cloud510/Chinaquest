import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { staticContent } from "@/lib/static-content";

export default async function HomePage() {
  const route = staticContent.routes[0];

  return (
    <SiteShell active="home">
      <div className="grid gap-6">
        <Card className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{ background: route.cover.gradient }}
          />
          <div className="relative grid gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="gold">Beijing</Pill>
              <Pill tone="red">ChinaQuest</Pill>
              <Pill>Web MVP</Pill>
            </div>

            <div className="grid gap-2">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Read Beijing through its Central Axis
              </h1>
              <p className="max-w-2xl text-pretty text-sm leading-6 text-white/80 md:text-base">
                Route quests, light interactions, badges, and a post-journey explorer report.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/routes" variant="secondary">
                Start exploring
              </Button>
              <Button href="/about" variant="ghost" className="border-white/20 text-white hover:bg-white/10">
                About
              </Button>
              <Button href="/login" variant="ghost" className="border-white/20 text-white hover:bg-white/10">
                Admin sign-in
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">
              Featured route
            </div>
            <div className="mt-2 text-lg font-semibold">{route.title.en}</div>
            <div className="mt-1 text-sm text-[color:var(--cq-muted)]">
              3 stops · 3 puzzles
            </div>
            <div className="mt-4">
              <Button href={`/routes/${route.id}`} size="sm">
                View details
              </Button>
            </div>
          </Card>

          <Card>
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">
              Demo scope
            </div>
            <div className="mt-2 text-lg font-semibold">Current demo plan</div>
            <div className="mt-1 text-sm text-[color:var(--cq-muted)]">
              The core loop, data model, analytics logging, and admin editing are ready for real-world iteration.
            </div>
            <div className="mt-4">
              <Button href="/routes" size="sm" variant="secondary">
                Start
              </Button>
            </div>
          </Card>

          <Card tone="ink">
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">
              Admin
            </div>
            <div className="mt-2 text-lg font-semibold">Content & analytics</div>
            <div className="mt-1 text-sm text-white/70">Edit content and download analytics.</div>
            <div className="mt-4">
              <Button href="/admin" size="sm" variant="secondary">
                Open admin
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
