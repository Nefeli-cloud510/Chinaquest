import { SiteShell } from "@/components/shell";
import { Card, Pill } from "@/components/ui";

// 函数名改为首页的名称（HomePage），active改为首页标识（比如"home"）
export default function HomePage() {
  return (
    <SiteShell active="home"> {/* 把about改成home，匹配导航栏的首页标识 */}
      <div className="grid gap-6">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="red">Deep culture</Pill>
            <Pill tone="gold">Gamified storytelling</Pill>
            <Pill>WebAR / AGI</Pill>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            About ChinaQuest
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--cq-muted)]">
            ChinaQuest helps independent international travelers experience Beijing with more depth and meaning.
            We connect before, during, and after the trip into a single journey: a narrative route, small missions,
            earned badges, and a personal report you can take home.
          </p>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold">Why a no-AR loop first</div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--cq-muted)]">
              Shipping the content model, progress state machine, and analytics first makes iteration faster in real
              settings. AR can then be layered in as a highlight without breaking the product flow.
            </div>
          </Card>
          <Card>
            <div className="text-sm font-semibold">Design language</div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--cq-muted)]">
              The palette takes cues from Beijing: palace red, imperial gold, and warm greys—paired with restrained
              textures and generous whitespace for a modern, premium feel.
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}