"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, Field, Pill } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/admin";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-dvh bg-[color:var(--cq-bg)]">
      <div className="mx-auto grid max-w-[920px] gap-6 px-4 py-10 md:grid-cols-2 md:px-6">
        <Card className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                "linear-gradient(135deg, rgba(180,0,34,0.95) 0%, rgba(242,194,0,0.85) 55%, rgba(17,19,24,0.65) 100%)",
            }}
          />
          <div className="relative grid gap-5 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="gold">Admin</Pill>
              <Pill tone="red">ChinaQuest</Pill>
              <Pill>Local MVP</Pill>
            </div>
            <div>
              <div className="text-2xl font-semibold tracking-tight">Admin sign-in</div>
              <div className="mt-2 text-sm leading-6 text-white/80">
                Sign in to edit content and download analytics. Playing as a guest does not require login.
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-white/85">
              Default email: admin@chinaquest.local
              <br />
              Default password: ChinaQuest2026!
            </div>
            <div className="text-xs text-white/70">
              Note: this is a local demo. Accounts are stored in data/users.json.
            </div>
          </div>
        </Card>

        <Card>
          <form
            className="grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (loading) return;
              setLoading(true);
              setError(null);
              try {
                const form = new FormData(e.currentTarget);
                const email = String(form.get("email") ?? "");
                const password = String(form.get("password") ?? "");
                const res = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ email, password }),
                });
                const json = (await res.json()) as { ok?: boolean; error?: string };
                if (!res.ok || !json.ok) throw new Error(json.error ?? "Sign-in failed");
                router.push(next);
                router.refresh();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Sign-in failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <div className="text-xl font-semibold tracking-tight">Sign in</div>
              <div className="mt-1 text-sm text-[color:var(--cq-muted)]">
                For admin configuration and data access
              </div>
            </div>

            <Field
              name="email"
              label="Email"
              placeholder="admin@chinaquest.local"
              defaultValue="admin@chinaquest.local"
            />
            <Field
              name="password"
              label="Password"
              type="password"
              placeholder="ChinaQuest2026!"
            />

            {error ? (
              <div className="rounded-2xl bg-[color:var(--cq-red)] px-4 py-3 text-sm text-white">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="secondary" className="flex-1">
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              <Button href="/" variant="ghost">
                Back to home
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
