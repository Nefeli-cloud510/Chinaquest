import { SiteShell } from "@/components/shell";
import { Button, Card, Pill } from "@/components/ui";

export default function LoginPage() {
  return (
    <SiteShell active="home">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="red">Static hosting</Pill>
          <Pill>Sign-in disabled</Pill>
        </div>
        <div className="mt-4 text-lg font-semibold">Sign in</div>
        <div className="mt-2 text-sm text-[color:var(--cq-muted)]">
          GitHub Pages serves static files only, so sign-in and admin APIs are not available. Run the project locally
          for admin features.
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/routes" variant="secondary">
            Browse routes
          </Button>
          <Button href="/" variant="ghost">
            Back to home
          </Button>
        </div>
      </Card>
    </SiteShell>
  );
}
