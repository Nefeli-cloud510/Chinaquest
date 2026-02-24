import { SiteShell } from "@/components/shell";
import { ContentEditor } from "@/components/content-editor";
import { Button, Card, Pill } from "@/components/ui";
import { ensureDefaultAdmin, getSessionFromCookie, getUserById } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { readJson } from "@/lib/store";

export default async function AdminPage() {
  await ensureDefaultAdmin();
  const session = await getSessionFromCookie();
  const user = session ? await getUserById(session.userId) : null;
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <SiteShell active="admin">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="red">Sign-in required</Pill>
            <Pill>Admin</Pill>
          </div>
          <div className="mt-4 text-lg font-semibold">Admin access only</div>
          <div className="mt-2 text-sm text-[color:var(--cq-muted)]">
            Use the default credentials: admin@chinaquest.local / ChinaQuest2026!
          </div>
          <div className="mt-4">
            <Button href="/login?next=/admin" variant="secondary">
              Sign in
            </Button>
          </div>
        </Card>
      </SiteShell>
    );
  }

  const content = await getContent();
  const eventsPath = "events.ndjson";
  const sessions = await readJson<{ sessions: unknown[] }>("sessions.json", { sessions: [] });
  const runs = await readJson<{ runs: unknown[] }>("runs.json", { runs: [] });

  return (
    <SiteShell active="admin">
      <div className="grid gap-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="gold">Admin</Pill>
                <Pill tone="red">{user.email}</Pill>
                <Pill>content v{content.version}</Pill>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">Admin</h1>
              <p className="mt-2 text-sm text-[color:var(--cq-muted)]">
                Local demo admin: edit content, and verify that analytics and data files are being written.
              </p>
            </div>
            <Button href="/api/admin/events" variant="ghost">
              Download analytics (NDJSON)
            </Button>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">Routes</div>
            <div className="mt-2 text-2xl font-semibold">{content.routes.length}</div>
          </Card>
          <Card>
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">Runs</div>
            <div className="mt-2 text-2xl font-semibold">{runs.runs.length}</div>
          </Card>
          <Card>
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">Sessions</div>
            <div className="mt-2 text-2xl font-semibold">{sessions.sessions.length}</div>
          </Card>
        </div>

        <ContentEditor />

        <Card>
          <div className="text-sm font-semibold">Analytics file</div>
          <div className="mt-2 text-sm text-[color:var(--cq-muted)]">
            data/{eventsPath} is appended as NDJSON. Use “Download analytics” to export it.
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
