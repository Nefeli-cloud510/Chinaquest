import { headers } from "next/headers";
import { appendNdjson, JsonValue } from "./store";

export type AnalyticsEvent = {
  name: string;
  ts: string;
  sessionId?: string;
  userId?: string;
  runId?: string;
  routeId?: string;
  poiId?: string;
  page?: string;
  locale?: "zh" | "en";
  props?: Record<string, JsonValue>;
};

export async function logEvent(event: AnalyticsEvent) {
  const h = await headers();
  const ua = h.get("user-agent") ?? "unknown";
  const payload: AnalyticsEvent = {
    ...event,
    props: { ...(event.props ?? {}), ua },
  };
  await appendNdjson("events.ndjson", payload);
}
