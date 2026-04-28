'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';
import { ARPOICard, ARMissionIntro, ARLocationScene } from '@/components/ar';

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

const poiAnnotations: Record<string, Array<{
  id: string;
  label: { zh: string; en: string };
  position: { x: number; y: number };
  popup?: { title: { zh: string; en: string }; content: { zh: string; en: string } };
}>> = {
  poi_qianmen_arrow_tower: [
    {
      id: 'ann-qianmen-axis',
      label: { zh: '中轴线起点', en: 'Central Axis Start' },
      position: { x: 50, y: 35 },
      popup: {
        title: { zh: '北京中轴线', en: 'Beijing Central Axis' },
        content: { zh: '前门是北京中轴线的南端起点。这条南北直线曾是都城规划的核心，标记着权力与秩序的边界。', en: 'Qianmen marks the southern starting point of Beijing\'s Central Axis—a straight line that once organized the entire capital as an expression of imperial order.' },
      },
    },
    {
      id: 'ann-qianmen-gate',
      label: { zh: '城门结构', en: 'Gate Structure' },
      position: { x: 30, y: 50 },
      popup: {
        title: { zh: '城门设计', en: 'Gate Design' },
        content: { zh: '城门采用典型的中国古代城楼设计：灰砖底座、红柱、分层瓦顶。这些元素共同构成了帝都的礼仪形象。', en: 'The gate features classic Chinese architectural design: grey brick base, red columns, and layered tiled roofs—together forming the ceremonial image of the imperial capital.' },
      },
    },
  ],
  poi_drum_tower: [
    {
      id: 'ann-drum-main',
      label: { zh: '主鼓', en: 'Main Drum' },
      position: { x: 50, y: 40 },
      popup: {
        title: { zh: '报时主鼓', en: 'Timekeeping Drum' },
        content: { zh: '鼓楼内置一面大鼓和24面小鼓。大鼓代表一年，24面小鼓代表二十四节气。每天傍晚，鼓声宣告城门将闭。', en: 'The Drum Tower houses one large drum representing the year and 24 smaller drums representing the solar terms. Each evening, the drumbeat announced that the city gates were closing.' },
      },
    },
    {
      id: 'ann-drum-view',
      label: { zh: '观景露台', en: 'Viewing Terrace' },
      position: { x: 75, y: 55 },
      popup: {
        title: { zh: '中轴线视野', en: 'Axis View' },
        content: { zh: '从鼓楼露台向南望去，可以看到中轴线一直延伸到故宫。这里是感受北京历史呼吸的最佳位置之一。', en: 'From this terrace, you can see the Central Axis stretching south toward the Forbidden City—one of the best spots to feel Beijing\'s history as a living rhythm.' },
      },
    },
  ],
  poi_birds_nest: [
    {
      id: 'ann-nest-steel',
      label: { zh: '钢结构外壳', en: 'Steel Shell' },
      position: { x: 45, y: 35 },
      popup: {
        title: { zh: '42,000吨钢材', en: '42,000 Tons of Steel' },
        content: { zh: '鸟巢使用了42,000吨钢材织就的外壳。结构本身就是建筑的身份——这是建筑师最大胆的决定。', en: 'The Bird\'s Nest uses 42,000 tons of woven steel. The structure itself is the building\'s identity—the architects\' boldest decision.' },
      },
    },
    {
      id: 'ann-nest-concept',
      label: { zh: '巢的概念', en: 'Nest Concept' },
      position: { x: 65, y: 50 },
      popup: {
        title: { zh: '孕育生命的巢', en: 'A Nest That Breeds Life' },
        content: { zh: '设计灵感来自"巢"的概念——一个孕育生命的容器。建筑不只是一座体育场，更是一个象征。', en: 'The design draws from the concept of a "nest"—a vessel that breeds life. The building is not just a stadium but a symbol.' },
      },
    },
  ],
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
      <ARLocationScene
        poiId={poiId}
        narrative={{
          intro: story.intro,
          hints: [story.arBeat],
        }}
        annotations={poiAnnotations[poiId] || []}
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
