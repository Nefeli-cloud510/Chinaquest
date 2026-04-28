'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';
import { ARPOICard, ARMissionIntro, ARScene } from '@/components/ar';

type ARView = 'card' | 'intro' | 'scene';

interface POIARWrapperProps {
  poiId: string;
  title: { zh: string; en: string };
  short: { zh: string; en: string };
  image?: string;
  story: { intro: { zh: string; en: string }; arBeat: { zh: string; en: string } };
  quizUrl: string;
}

const wrapperLabels = {
  exploreTitle: { zh: 'AR 探索', en: 'AR Exploration' },
  exploreHint: { zh: '使用相机扫描场景，解锁隐藏线索', en: 'Use your camera to scan the scene and unlock hidden clues' },
};

export function POIARWrapper({
  poiId,
  title,
  short,
  image,
  story,
  quizUrl,
}: POIARWrapperProps) {
  const { language } = useLanguage();
  const [arView, setARView] = useState<ARView>('card');

  // 模拟已到达站点
  const isArrived = true;

  if (arView === 'scene') {
    return (
      <ARScene
        poiId={poiId}
        narrative={{
          intro: story.intro,
          hints: [story.arBeat],
        }}
        annotations={[
          {
            id: 'ann-1',
            label: { zh: '建筑结构', en: 'Architecture' },
            position: { x: 30, y: 40 },
            popup: {
              title: { zh: '观察结构', en: 'Observe Structure' },
              content: { zh: '注意建筑的独特结构和设计元素', en: 'Notice the unique structure and design elements' },
            },
          },
          {
            id: 'ann-2',
            label: { zh: '历史痕迹', en: 'History Marks' },
            position: { x: 70, y: 50 },
            popup: {
              title: { zh: '历史痕迹', en: 'Historical Marks' },
              content: { zh: '寻找建筑上留下的历史痕迹', en: 'Look for historical marks left on the building' },
            },
          },
        ]}
        onClose={() => setARView('card')}
        onAnswerQuiz={() => window.location.href = quizUrl}
      />
    );
  }

  return (
    <div className="grid gap-6">
      {/* AR 探索标题 */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--cq-gold)] to-[color:var(--cq-gold-2)] flex items-center justify-center">
            <span className="text-xl">🔍</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--cq-text)]">
              {wrapperLabels.exploreTitle[language]}
            </h2>
            <p className="text-xs text-[color:var(--cq-muted)]">
              {wrapperLabels.exploreHint[language]}
            </p>
          </div>
        </div>
      </Card>

      {arView === 'card' && (
        <ARPOICard
          poiId={poiId}
          title={title}
          short={short}
          image={image}
          isArrived={isArrived}
          onEnterAR={() => setARView('intro')}
          onStartQuiz={() => window.location.href = quizUrl}
        />
      )}

      {arView === 'intro' && (
        <ARMissionIntro
          story={story.intro}
          arBeat={story.arBeat}
          onBegin={() => setARView('scene')}
        />
      )}
    </div>
  );
}
