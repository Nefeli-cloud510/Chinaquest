import content from "../../data/content.json";

export type StaticI18nText = { zh: string; en: string };

export type StaticRoute = {
  id: string;
  title: StaticI18nText;
  summary: StaticI18nText;
  estimatedMinutes: number;
  city: string;
  poiIds: string[];
  rules: { zh: string[]; en: string[] };
  cover: { gradient: string; accent: "red" | "gold" };
};

export type StaticPoi = {
  id: string;
  routeId: string;
  order: number;
  geo: { lat: number; lng: number };
  title: StaticI18nText;
  short: StaticI18nText;
  arriveHint: StaticI18nText;
  scanHint: StaticI18nText;
  story: {
    intro: StaticI18nText;
    arBeat: StaticI18nText;
  };
  quizId: string;
  rewards: { badgeId: string };
};

export type StaticQuizChoice = { key: string; zh: string; en: string };
export type StaticQuiz = {
  id: string;
  type: "single_choice";
  question: StaticI18nText;
  choices: StaticQuizChoice[];
  answerKey: string;
  hints: { level: 1 | 2; zh: string; en: string }[];
  explain: StaticI18nText;
};

export type StaticBadge = {
  id: string;
  title: StaticI18nText;
  desc: StaticI18nText;
  color: "red" | "gold" | "ink";
  icon: "gate" | "drum" | "nest" | "axis";
};

export type StaticContent = {
  version: number;
  routes: StaticRoute[];
  pois: StaticPoi[];
  quizzes: StaticQuiz[];
  badges: StaticBadge[];
};

export const staticContent = content as StaticContent;

export function getStaticRoute(routeId: string) {
  return staticContent.routes.find((r) => r.id === routeId) ?? null;
}

export function getStaticPoi(poiId: string) {
  return staticContent.pois.find((p) => p.id === poiId) ?? null;
}

export function getStaticQuiz(quizId: string) {
  return staticContent.quizzes.find((q) => q.id === quizId) ?? null;
}

