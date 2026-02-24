"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui";

export function StartRunButton(props: { routeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        try {
          const res = await fetch("/api/runs", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ routeId: props.routeId }),
          });
          const json = (await res.json()) as { runId?: string; error?: string };
          if (!res.ok || !json.runId) throw new Error(json.error ?? "RunCreateFailed");
          router.push(`/run/${json.runId}`);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Creating…" : "Start"}
    </Button>
  );
}
