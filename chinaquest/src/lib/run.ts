import { getBadge, getContent, getPoi, getQuiz, getRoute } from "./content";
import { newId, readJson, updateJson } from "./store";

export type RunPoiStatus = "locked" | "available" | "in_progress" | "completed";

export type RunPoiProgress = {
  poiId: string;
  status: RunPoiStatus;
  startedAt?: string;
  completedAt?: string;
  lastQuizAttemptId?: string;
};

export type Run = {
  id: string;
  userId: string;
  routeId: string;
  createdAt: string;
  completedAt?: string;
  locale: "zh" | "en";
  poiProgress: RunPoiProgress[];
  earnedBadgeIds: string[];
};

type RunsFile = { runs: Run[] };
const RUNS_FILE = "runs.json";

function initPoiProgress(poiIds: string[]) {
  return poiIds.map((poiId, idx) => ({
    poiId,
    status: idx === 0 ? ("available" as const) : ("locked" as const),
  }));
}

export async function createRun(params: {
  userId: string;
  routeId: string;
  locale: "zh" | "en";
}) {
  const route = await getRoute(params.routeId);
  if (!route) throw new Error("RouteNotFound");

  const run: Run = {
    id: newId("run"),
    userId: params.userId,
    routeId: params.routeId,
    createdAt: new Date().toISOString(),
    locale: params.locale,
    poiProgress: initPoiProgress(route.poiIds),
    earnedBadgeIds: [],
  };

  await updateJson<RunsFile>(RUNS_FILE, { runs: [] }, (current) => {
    return { runs: [run, ...current.runs].slice(0, 5000) };
  });

  return run;
}

export async function getRun(runId: string) {
  const data = await readJson<RunsFile>(RUNS_FILE, { runs: [] });
  return data.runs.find((r) => r.id === runId) ?? null;
}

export async function listRunsForUser(userId: string) {
  const data = await readJson<RunsFile>(RUNS_FILE, { runs: [] });
  return data.runs.filter((r) => r.userId === userId).slice(0, 50);
}

export async function startPoi(runId: string, poiId: string) {
  const poi = await getPoi(poiId);
  if (!poi) throw new Error("PoiNotFound");

  return updateJson<RunsFile>(RUNS_FILE, { runs: [] }, (current) => {
    const idx = current.runs.findIndex((r) => r.id === runId);
    if (idx < 0) throw new Error("RunNotFound");
    const run = current.runs[idx];
    const progress = run.poiProgress.map((p) => {
      if (p.poiId !== poiId) return p;
      if (p.status === "locked") return p;
      if (p.status === "completed") return p;
      return { ...p, status: "in_progress", startedAt: p.startedAt ?? new Date().toISOString() };
    });
    const next: Run = { ...run, poiProgress: progress };
    const runs = [...current.runs];
    runs[idx] = next;
    return { runs };
  });
}

export async function completePoi(params: {
  runId: string;
  poiId: string;
  quizAttemptId: string;
  correct: boolean;
}) {
  const poi = await getPoi(params.poiId);
  if (!poi) throw new Error("PoiNotFound");
  const quiz = await getQuiz(poi.quizId);
  if (!quiz) throw new Error("QuizNotFound");

  if (!params.correct) throw new Error("QuizNotCorrect");

  const route = await getRoute(poi.routeId);
  if (!route) throw new Error("RouteNotFound");

  await getBadge(poi.rewards.badgeId);

  return updateJson<RunsFile>(RUNS_FILE, { runs: [] }, (current) => {
    const idx = current.runs.findIndex((r) => r.id === params.runId);
    if (idx < 0) throw new Error("RunNotFound");
    const run = current.runs[idx];

    const progress = run.poiProgress.map((p, i) => {
      if (p.poiId === params.poiId) {
        return {
          ...p,
          status: "completed" as const,
          completedAt: new Date().toISOString(),
          lastQuizAttemptId: params.quizAttemptId,
        };
      }
      if (i > 0 && run.poiProgress[i - 1]?.poiId === params.poiId) {
        if (p.status === "locked") return { ...p, status: "available" as const };
      }
      return p;
    });

    const earned = new Set(run.earnedBadgeIds);
    earned.add(poi.rewards.badgeId);

    const allPoiCompleted = progress.every((p) => p.status === "completed");
    if (allPoiCompleted) {
      earned.add("badge_axis_complete");
    }

    const next: Run = {
      ...run,
      poiProgress: progress,
      earnedBadgeIds: Array.from(earned),
      completedAt: allPoiCompleted ? run.completedAt ?? new Date().toISOString() : run.completedAt,
    };

    const runs = [...current.runs];
    runs[idx] = next;
    return { runs };
  });
}

export async function buildReport(runId: string) {
  const run = await getRun(runId);
  if (!run) return null;
  const route = await getRoute(run.routeId);
  if (!route) return null;
  const content = await getContent();

  const poiCards = route.poiIds
    .map((poiId) => content.pois.find((p) => p.id === poiId))
    .filter(Boolean)
    .map((poi) => {
      const status = run.poiProgress.find((p) => p.poiId === poi!.id)?.status ?? "locked";
      return { poi: poi!, status };
    });

  const badgeCards = run.earnedBadgeIds
    .map((id) => content.badges.find((b) => b.id === id))
    .filter(Boolean);

  return { run, route, poiCards, badgeCards };
}

