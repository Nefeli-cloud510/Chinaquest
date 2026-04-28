'use client';

import { useLanguage } from '@/lib/language';
import { SiteShell } from '@/components/shell';
import { Button, Card, Pill } from '@/components/ui';
import { staticContent } from '@/lib/static-content';

const homeLabels = {
  beijing: { zh: '北京', en: 'Beijing' },
  title: { zh: '通过北京中轴线阅读这座城市', en: 'Read Beijing through its Central Axis' },
  description: { zh: '路线任务、轻量互动、徽章与行程探索报告。', en: 'Route quests, light interactions, badges, and a post-journey explorer report.' },
  startExploring: { zh: '开始探索', en: 'Start exploring' },
  about: { zh: '关于', en: 'About' },
  adminSignIn: { zh: '管理员登录', en: 'Admin sign-in' },
  featuredRoute: { zh: '精选路线', en: 'Featured route' },
  demoScope: { zh: '演示范围', en: 'Demo scope' },
  demoPlan: { zh: '当前演示版本', en: 'Current demo plan' },
  demoDesc: { zh: '核心交互循环、数据模型、分析日志和管理员编辑已准备就绪。', en: 'The core loop, data model, analytics logging, and admin editing are ready for real-world iteration.' },
  start: { zh: '开始', en: 'Start' },
  admin: { zh: '管理员', en: 'Admin' },
  contentAnalytics: { zh: '内容与分析', en: 'Content & analytics' },
  contentDesc: { zh: '编辑内容并下载分析数据。', en: 'Edit content and download analytics.' },
  openAdmin: { zh: '打开管理后台', en: 'Open admin' },
  viewDetails: { zh: '查看详情', en: 'View details' },
  webMvp: { zh: '网页版', en: 'Web MVP' },
  stops: { zh: '站', en: 'stops' },
  puzzles: { zh: '谜题', en: 'puzzles' },
};

export default function HomePage() {
  const route = staticContent.routes[0];
  const { language } = useLanguage();

  return (
    <SiteShell active="home">
      <div className="grid gap-6">
        <Card className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{ background: route.cover.gradient }}
          />
          <div className="relative grid gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="gold">{homeLabels.beijing[language]}</Pill>
              <Pill tone="red">ChinaQuest</Pill>
              <Pill>{homeLabels.webMvp[language]}</Pill>
            </div>

            <div className="grid gap-2">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {homeLabels.title[language]}
              </h1>
              <p className="max-w-2xl text-pretty text-sm leading-6 text-white/80 md:text-base">
                {homeLabels.description[language]}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/routes" variant="secondary">
                {homeLabels.startExploring[language]}
              </Button>
              <Button href="/about" variant="ghost" className="border-white/20 text-white hover:bg-white/10">
                {homeLabels.about[language]}
              </Button>
              <Button href="/login" variant="ghost" className="border-white/20 text-white hover:bg-white/10">
                {homeLabels.adminSignIn[language]}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">
              {homeLabels.featuredRoute[language]}
            </div>
            <div className="mt-2 text-lg font-semibold">{route.title[language]}</div>
            <div className="mt-1 text-sm text-[color:var(--cq-muted)]">
              {route.poiIds.length} {homeLabels.stops[language]} · {route.poiIds.length} {homeLabels.puzzles[language]}
            </div>
            <div className="mt-4">
              <Button href={`/routes/${route.id}`} size="sm">
                {homeLabels.viewDetails[language]}
              </Button>
            </div>
          </Card>

          <Card>
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">
              {homeLabels.demoScope[language]}
            </div>
            <div className="mt-2 text-lg font-semibold">{homeLabels.demoPlan[language]}</div>
            <div className="mt-1 text-sm text-[color:var(--cq-muted)]">
              {homeLabels.demoDesc[language]}
            </div>
            <div className="mt-4">
              <Button href="/routes" size="sm" variant="secondary">
                {homeLabels.start[language]}
              </Button>
            </div>
          </Card>

          <Card tone="ink">
            <div className="text-xs font-medium text-[color:var(--cq-muted)]">
              {homeLabels.admin[language]}
            </div>
            <div className="mt-2 text-lg font-semibold">{homeLabels.contentAnalytics[language]}</div>
            <div className="mt-1 text-sm text-white/70">{homeLabels.contentDesc[language]}</div>
            <div className="mt-4">
              <Button href="/admin" size="sm" variant="secondary">
                {homeLabels.openAdmin[language]}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
