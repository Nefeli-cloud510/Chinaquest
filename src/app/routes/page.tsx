import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { staticContent } from "@/lib/static-content";

export default async function RoutesPage() {
  const content = staticContent;

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Routes</h1>
              <p className="mt-2 text-sm text-[color:var(--cq-muted)]">
                Pick a route, complete each stop’s puzzle, earn badges, and generate a report.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {content.routes.map((r) => (
            <Card key={r.id} className="relative overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-90"
                style={{ background: r.cover.gradient }}
              />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="gold">{r.city}</Pill>
                  <Pill tone={r.cover.accent === "gold" ? "gold" : "red"}>
                    MVP
                  </Pill>
                  <Pill>{r.poiIds.length} stops</Pill>
                </div>
                <div className="mt-4 text-xl font-semibold text-white">
                  {r.title.en}
                </div>
                <div className="mt-1 text-sm text-white/85">
                  {r.tagline?.en ?? r.summary.en}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button href={`/routes/${r.id}`} variant="secondary" size="sm">
                    View & start
                  </Button>
                  <span className="text-xs text-white/70">
                    ~ {r.estimatedMinutes} min
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
