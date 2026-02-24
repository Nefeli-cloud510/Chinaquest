import { SiteShell } from "@/components/shell";
import { StartRunButton } from "@/components/start-run-button";
import { Button, Card, Pill } from "@/components/ui";
import { getContent, getRoute } from "@/lib/content";

export default async function RouteDetailPage(props: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await props.params;
  const route = await getRoute(routeId);
  if (!route) {
    return (
      <SiteShell active="routes">
        <Card>
          <div className="text-sm text-[color:var(--cq-muted)]">Route not found</div>
          <div className="mt-3">
            <Button href="/routes" variant="secondary" size="sm">
              Back to routes
            </Button>
          </div>
        </Card>
      </SiteShell>
    );
  }

  const content = await getContent();
  const pois = route.poiIds
    .map((id) => content.pois.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <Card className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{ background: route.cover.gradient }}
          />
          <div className="relative grid gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="gold">{route.city}</Pill>
              <Pill tone="red">Central Axis</Pill>
              <Pill>{pois.length} stops</Pill>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {route.title.en}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/80">
                {route.summary.en}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StartRunButton routeId={route.id} />
              <Button
                href="/routes"
                variant="ghost"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
              <span className="text-xs text-white/70">
                ~ {route.estimatedMinutes} min
              </span>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {pois.map((p) => (
            <Card key={p!.id}>
              <div className="text-xs font-medium text-[color:var(--cq-muted)]">
                Stop {p!.order}
              </div>
              <div className="mt-2 text-lg font-semibold">{p!.title.en}</div>
              <div className="mt-1 text-sm text-[color:var(--cq-muted)]">
                {p!.short.en}
              </div>
              <div className="mt-4">
                <Button href={`/poi/${p!.id}`} size="sm" variant="ghost">
                  View stop
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="text-sm font-semibold">How it works</div>
          <div className="mt-2 grid gap-2 text-sm text-[color:var(--cq-muted)]">
            {route.rules.en.map((t) => (
              <div key={t}>· {t}</div>
            ))}
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
