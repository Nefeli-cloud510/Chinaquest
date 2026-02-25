import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";

export default async function AdminPage() {
  return (
    <SiteShell active="admin">
      <div className="grid gap-6">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="red">Static hosting</Pill>
            <Pill>Admin disabled</Pill>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-2 text-sm text-[color:var(--cq-muted)]">
            GitHub Pages serves static files only, so admin features and analytics downloads are not available here.
            Run the project locally for the full experience.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/routes" variant="secondary">
              Browse routes
            </Button>
            <Button href="/" variant="ghost">
              Back to home
            </Button>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
