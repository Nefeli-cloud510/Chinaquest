import { SiteShell } from "@/components/shell";
import { QuizClient } from "@/components/quiz-client";
import { Button, Card, Pill } from "@/components/ui";
import { getStaticBadge, getStaticPoi, getStaticQuiz, staticContent } from "@/lib/static-content";

export function generateStaticParams() {
  return staticContent.pois.map((p) => ({ poiId: p.id }));
}

export default async function PoiQuizPage(props: {
  params: Promise<{ poiId: string }>;
}) {
  const { poiId } = await props.params;
  const poi = getStaticPoi(poiId);
  if (!poi) {
    return (
      <SiteShell active="routes">
        <Card>
          <div className="text-sm text-[color:var(--cq-muted)]">Stop not found</div>
          <div className="mt-4">
            <Button href="/routes" size="sm" variant="secondary">
              Back to routes
            </Button>
          </div>
        </Card>
      </SiteShell>
    );
  }
  const quiz = getStaticQuiz(poi.quizId);
  if (!quiz) {
    return (
      <SiteShell active="routes">
        <Card>
          <div className="text-sm text-[color:var(--cq-muted)]">Puzzle not found</div>
        </Card>
      </SiteShell>
    );
  }
  const badge = getStaticBadge(poi.rewards.badgeId);
  const finale = getStaticBadge("badge_axis_complete");

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <Card className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="gold">Stop {poi.order}</Pill>
              <Pill tone="red">{poi.title.en}</Pill>
            </div>
            <div className="mt-3 text-xl font-semibold">{poi.title.en} · Puzzle</div>
            <div className="mt-1 text-sm text-[color:var(--cq-muted)]">
              Solve the puzzle to earn the stop badge and advance your progress.
            </div>
          </div>
          <Button href={`/poi/${poiId}`} variant="ghost">
            Back to stop
          </Button>
        </Card>

        <QuizClient poiId={poiId} quiz={quiz} badge={badge ?? undefined} finale={finale ?? undefined} />
      </div>
    </SiteShell>
  );
}
