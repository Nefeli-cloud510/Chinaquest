import { SiteShell } from "@/components/shell";
import { StartPoiButton } from "@/components/start-poi-button";
import { Button, Card, Pill } from "@/components/ui";
import { getPoi, getRoute } from "@/lib/content";
import { getRun } from "@/lib/run";

export default async function PoiPage(props: {
  params: Promise<{ poiId: string }>;
  searchParams: Promise<{ runId?: string }>;
}) {
  const { poiId } = await props.params;
  const { runId } = await props.searchParams;
  const poi = await getPoi(poiId);
  if (!poi) {
    return (
      <SiteShell active="routes">
        <Card>
          <div className="text-sm text-[color:var(--cq-muted)]">Stop not found</div>
          <div className="mt-4">
            <Button href="/routes" size="sm" variant="secondary">
              Back to routes
            </Button>
          </div>
        </Card>
      </SiteShell>
    );
  }

  const route = await getRoute(poi.routeId);
  const run = runId ? await getRun(runId) : null;
  const progress = run?.poiProgress.find((p) => p.poiId === poiId)?.status ?? null;

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
              <Pill tone="gold">Stop {poi.order}</Pill>
              {progress ? (
                <Pill tone={progress === "completed" ? "gold" : "red"}>
                  {progress === "completed"
                    ? "Completed"
                    : progress === "available"
                      ? "Available"
                      : progress === "in_progress"
                        ? "In progress"
                        : "Locked"}
                </Pill>
              ) : (
                <Pill>Preview</Pill>
              )}
              <Pill>{poi.title.en}</Pill>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {poi.title.en}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/80">
                {poi.short.en}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <StartPoiButton runId={runId} poiId={poiId} />
              <Button
                href={`/poi/${poiId}/quiz${runId ? `?runId=${encodeURIComponent(runId)}` : ""}`}
                variant="secondary"
              >
                Start puzzle
              </Button>
              <Button
                href="#"
                variant="ghost"
                className="pointer-events-none border-white/20 text-white opacity-70"
              >
                Open AR (next phase)
              </Button>
              {runId ? (
                <Button
                  href={`/run/${runId}`}
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Back to progress
                </Button>
              ) : (
                <Button
                  href={`/routes/${poi.routeId}`}
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Back to route
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold">Arrival tips</div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--cq-muted)]">
              {poi.arriveHint.en}
            </div>
          </Card>
          <Card>
            <div className="text-sm font-semibold">Story hook</div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--cq-muted)]">
              {poi.story.intro.en}
            </div>
          </Card>
        </div>

        <Card>
          <div className="text-sm font-semibold">Scan instructions (MVP placeholder)</div>
          <div className="mt-2 text-sm leading-6 text-[color:var(--cq-muted)]">
            {poi.scanHint.en}
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
