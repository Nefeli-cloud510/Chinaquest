import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { getContent, getRoute } from "@/lib/content";
import { buildReport, getRun } from "@/lib/run";

export default async function RunDetailPage(props: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await props.params;
  const run = await getRun(runId);
  if (!run) {
    return (
      <SiteShell active="routes">
        <Card>
          <div className="text-sm text-[color:var(--cq-muted)]">Run not found</div>
          <div className="mt-4">
            <Button href="/routes" size="sm" variant="secondary">
              Back to routes
            </Button>
          </div>
        </Card>
      </SiteShell>
    );
  }

  const route = await getRoute(run.routeId);
  const content = await getContent();
  const progress = run.poiProgress.map((p) => ({
    ...p,
    poi: content.pois.find((x) => x.id === p.poiId),
  }));

  const current =
    progress.find((p) => p.status === "in_progress") ??
    progress.find((p) => p.status === "available") ??
    progress[0];

  const completedCount = progress.filter((p) => p.status === "completed").length;

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <Card className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{ background: route?.cover.gradient }}
          />
          <div className="relative grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="gold">{route?.city ?? "Beijing"}</Pill>
              <Pill>
                Progress {completedCount}/{progress.length}
              </Pill>
              {run.completedAt ? <Pill tone="gold">Completed</Pill> : <Pill>In progress</Pill>}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {route?.title.en ?? run.routeId}
              </h1>
              <div className="mt-1 text-sm text-white/80">
                Current stop: {current?.poi?.title.en ?? current.poiId}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href={`/poi/${current.poiId}?runId=${run.id}`} variant="secondary">
                Open stop
              </Button>
              <Button
                href={`/report/${run.id}`}
                variant="ghost"
                className="border-white/20 text-white hover:bg-white/10"
              >
                View report
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {progress.map((p) => (
            <Card key={p.poiId}>
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-medium text-[color:var(--cq-muted)]">
                  Stop {p.poi?.order ?? "-"}
                </div>
                {p.status === "completed" ? (
                  <Pill tone="gold">Done</Pill>
                ) : p.status === "available" ? (
                  <Pill tone="red">Available</Pill>
                ) : p.status === "in_progress" ? (
                  <Pill tone="red">In progress</Pill>
                ) : (
                  <Pill>Locked</Pill>
                )}
              </div>
              <div className="mt-2 text-lg font-semibold">{p.poi?.title.en ?? p.poiId}</div>
              <div className="mt-1 text-sm text-[color:var(--cq-muted)]">
                {p.poi?.short.en ?? ""}
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  href={`/poi/${p.poiId}?runId=${run.id}`}
                  size="sm"
                  variant={p.status === "locked" ? "ghost" : "secondary"}
                  className={p.status === "locked" ? "pointer-events-none opacity-60" : undefined}
                >
                  {p.status === "completed" ? "Review" : "Open"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
