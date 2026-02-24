import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { getStaticPoi, getStaticRoute, staticContent } from "@/lib/static-content";

export function generateStaticParams() {
  return staticContent.pois.map((p) => ({ poiId: p.id }));
}

export default async function PoiPage(props: {
  params: Promise<{ poiId: string }>;
}) {
  const { poiId } = await props.params;
  const poi = getStaticPoi(poiId);
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

  const route = getStaticRoute(poi.routeId);

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
              <Pill>Preview</Pill>
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
              <Button
                href={`/poi/${poiId}/quiz`}
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
              <Button
                href={`/routes/${poi.routeId}`}
                variant="ghost"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back to route
              </Button>
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
