import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";
import { getRoute } from "@/lib/content";
import { getOrCreateUserIdentity } from "@/lib/identity";
import { listRunsForUser } from "@/lib/run";

export default async function RunListPage() {
  const { userId } = await getOrCreateUserIdentity();
  const runs = await listRunsForUser(userId);

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">My runs</h1>
              <p className="mt-2 text-sm text-[color:var(--cq-muted)]">
                Your saved route sessions. Continue where you left off or view the report.
              </p>
            </div>
            <Button href="/routes" variant="secondary">
              Choose a route
            </Button>
          </div>
        </Card>

        {runs.length === 0 ? (
          <Card>
            <div className="text-sm text-[color:var(--cq-muted)]">
              No runs yet.
            </div>
            <div className="mt-4">
              <Button href="/routes" size="sm" variant="secondary">
                Start now
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {await Promise.all(
              runs.map(async (run) => {
                const route = await getRoute(run.routeId);
                const completed = run.poiProgress.filter((p) => p.status === "completed").length;
                return (
                  <Card key={run.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="gold">{route?.city ?? "Beijing"}</Pill>
                      <Pill>
                        {completed}/{run.poiProgress.length} done
                      </Pill>
                      {run.completedAt ? <Pill tone="gold">Completed</Pill> : <Pill>In progress</Pill>}
                    </div>
                    <div className="mt-3 text-lg font-semibold">
                      {route?.title.en ?? run.routeId}
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--cq-muted)]">
                      RunId: {run.id}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button href={`/run/${run.id}`} size="sm" variant="secondary">
                        Continue
                      </Button>
                      <Button href={`/report/${run.id}`} size="sm" variant="ghost">
                        View report
                      </Button>
                    </div>
                  </Card>
                );
              }),
            )}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
