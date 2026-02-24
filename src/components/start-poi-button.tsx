"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui";

export function StartPoiButton(props: { runId?: string; poiId: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);

  const runId = props.runId ?? search.get("runId") ?? undefined;

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        if (!runId || loading) return;
        setLoading(true);
        try {
          await fetch(`/api/runs/${encodeURIComponent(runId)}/poi/${encodeURIComponent(props.poiId)}/start`, {
            method: "POST",
          });
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
      className={!runId ? "pointer-events-none opacity-60" : undefined}
    >
      {loading ? "Starting…" : "Start this stop"}
    </Button>
  );
}
