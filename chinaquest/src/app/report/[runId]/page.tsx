import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { buildReport } from "@/lib/run";

export default async function ReportPage(props: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await props.params;
  const report = await buildReport(runId);
  if (!report) {
    return (
      <SiteShell active="routes">
        <Card>
          <div className="text-sm text-[color:var(--cq-muted)]">Report not found</div>
          <div className="mt-4">
            <Button href="/routes" size="sm" variant="secondary">
              Back to routes
            </Button>
          </div>
        </Card>
      </SiteShell>
    );
  }

  const { run, route, poiCards, badgeCards } = report;
  const completed = poiCards.filter((p) => p.status === "completed").length;

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <Card className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{ background: route.cover.gradient }}
          />
          <div className="relative grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="gold">{route.city}</Pill>
              <Pill>
                Progress {completed}/{poiCards.length}
              </Pill>
              {run.completedAt ? <Pill tone="gold">Completed</Pill> : <Pill>In progress</Pill>}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Explorer report
              </h1>
              <div className="mt-1 text-sm text-white/80">{route.title.en}</div>
              <div className="mt-1 text-xs text-white/70">RunId: {run.id}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href={`/run/${run.id}`} variant="secondary">
                Back to progress
              </Button>
              <Button
                href="#"
                variant="ghost"
                className="pointer-events-none border-white/20 text-white opacity-70"
              >
                Share card (next phase)
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold">Route recap</div>
            <div className="mt-4 grid gap-3">
              {poiCards.map(({ poi, status }) => (
                <div
                  key={poi.id}
                  className="flex items-center justify-between rounded-2xl border bg-[color:var(--cq-surface-2)] px-4 py-3 border-[color:var(--cq-border)]"
                >
                  <div>
                    <div className="text-sm font-semibold">{poi.title.en}</div>
                    <div className="text-xs text-[color:var(--cq-muted)]">{poi.id}</div>
                  </div>
                  <Pill tone={status === "completed" ? "gold" : status === "available" ? "red" : "neutral"}>
                    {status === "completed"
                      ? "Done"
                      : status === "available"
                        ? "To do"
                        : status === "in_progress"
                          ? "In progress"
                          : "Locked"}
                  </Pill>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="text-sm font-semibold">Unlocked badges</div>
            <div className="mt-4 grid gap-3">
              {badgeCards.length === 0 ? (
                <div className="text-sm text-[color:var(--cq-muted)]">No badges yet</div>
              ) : (
                badgeCards.map((b) => (
                  <div
                    key={b!.id}
                    className="rounded-2xl border bg-[color:var(--cq-surface-2)] px-4 py-3 border-[color:var(--cq-border)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-semibold">{b!.title.en}</div>
                      <Pill tone="gold">★</Pill>
                    </div>
                    <div className="mt-1 text-sm text-[color:var(--cq-muted)]">{b!.desc.en}</div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
