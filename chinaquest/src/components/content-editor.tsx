"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "./ui";

export function ContentEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/content");
      if (!res.ok) {
        setValue("");
        setStatus("Unable to load content (admin sign-in required).");
        setLoading(false);
        return;
      }
      const json = (await res.json()) as { content: unknown };
      setValue(JSON.stringify(json.content, null, 2));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="text-sm text-[color:var(--cq-muted)]">Loading…</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Content config (content.json)</div>
          <div className="mt-1 text-xs text-[color:var(--cq-muted)]">
            Edit the JSON and save to apply changes (local demo). Make a backup before saving.
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            setSaving(true);
            setStatus(null);
            try {
              const parsed = JSON.parse(value) as unknown;
              const res = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ content: parsed }),
              });
              const json = (await res.json()) as { ok?: boolean; error?: string };
              if (!res.ok || !json.ok) throw new Error(json.error ?? "Save failed");
              setStatus("Saved");
            } catch (e) {
              setStatus(e instanceof Error ? e.message : "Save failed");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {status ? (
        <div className="mt-4 rounded-2xl bg-black/5 px-4 py-3 text-sm text-[color:var(--cq-muted)]">
          {status}
        </div>
      ) : null}

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-4 h-[420px] w-full rounded-3xl border bg-[color:var(--cq-surface-2)] p-4 font-mono text-xs leading-5 border-[color:var(--cq-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cq-gold)]"
      />
    </Card>
  );
}
