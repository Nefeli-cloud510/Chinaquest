import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { getStaticRoute, staticContent } from "@/lib/static-content";

export function generateStaticParams() {
  return staticContent.routes.map((r) => ({ routeId: r.id }));
}

export default async function RouteDetailPage(props: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await props.params;
  const route = getStaticRoute(routeId);
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

  const pois = route.poiIds
    .map((id) => staticContent.pois.find((p) => p.id === id))
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
                {route.headline?.en ?? route.title.en}
              </h1>
              {route.headline?.zh ? (
                <div className="mt-2 max-w-3xl text-sm leading-6 text-white/80">
                  {route.headline.zh}
                </div>
              ) : null}
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/80">
                {route.tagline?.en ?? route.summary.en}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="#stops" variant="secondary">
                Explore stops
              </Button>
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

        {route.intro?.en ? (
          <Card>
            <div className="text-sm font-semibold">Route overview</div>
            <div className="mt-2 whitespace-pre-line text-sm leading-6 text-[color:var(--cq-muted)]">
              {route.intro.en}
            </div>
          </Card>
        ) : null}

        <div id="stops" className="grid gap-6 md:grid-cols-3">
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold">How it works</div>
            <div className="mt-2 grid gap-2 text-sm text-[color:var(--cq-muted)]">
              {route.rules.en.map((t) => (
                <div key={t}>· {t}</div>
              ))}
            </div>
          </Card>

          {route.pacing?.en?.length ? (
            <Card>
              <div className="text-sm font-semibold">Pacing</div>
              <div className="mt-2 grid gap-2 text-sm text-[color:var(--cq-muted)]">
                {route.pacing.en.map((t) => (
                  <div key={t}>· {t}</div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>

        {route.prep?.en?.length ? (
          <Card>
            <div className="text-sm font-semibold">Before you go</div>
            <div className="mt-2 grid gap-2 text-sm text-[color:var(--cq-muted)]">
              {route.prep.en.map((t) => (
                <div key={t}>· {t}</div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </SiteShell>
  );
}
