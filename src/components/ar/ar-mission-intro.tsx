'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';

interface ARMissionIntroProps {
  title?: { zh: string; en: string };
  story: { zh: string; en: string };
  arBeat: { zh: string; en: string };
  onBegin: () => void;
}

const missionLabels = {
  missionTitle: { zh: '任务引子', en: 'Mission Briefing' },
  arBeatTitle: { zh: 'AR体验提示', en: 'AR Experience Hint' },
  beginMission: { zh: '开始任务', en: 'Begin Mission' },
};

export function ARMissionIntro({ title, story, arBeat, onBegin }: ARMissionIntroProps) {
  const { language } = useLanguage();
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <div className="rounded-3xl border border-[color:var(--cq-border)] bg-[color:var(--cq-surface)] p-6 shadow-[0_12px_32px_var(--cq-shadow)]">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-[color:var(--cq-gold)] flex items-center justify-center">
          <svg className="w-4 h-4 text-[color:var(--cq-ink)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[color:var(--cq-text)]">
          {title ? title[language] : missionLabels.missionTitle[language]}
        </h3>
      </div>

      {/* 任务故事 */}
      <div className="mb-4">
        <p className={`text-sm text-[color:var(--cq-muted)] leading-relaxed ${!showFullStory ? 'line-clamp-3' : ''}`}>
          {story[language]}
        </p>
        <button
          onClick={() => setShowFullStory(!showFullStory)}
          className="mt-2 text-xs text-[color:var(--cq-gold)] font-medium hover:underline"
        >
          {showFullStory ? '收起' : language === 'zh' ? '展开阅读' : 'Read More'}
        </button>
      </div>

      {/* AR体验提示 */}
      <div className="mb-4 p-4 rounded-2xl bg-[color:var(--cq-ink)] text-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-xs font-semibold">{missionLabels.arBeatTitle[language]}</span>
        </div>
        <p className="text-sm text-white/85 leading-relaxed">
          {arBeat[language]}
        </p>
      </div>

      {/* 开始任务按钮 */}
      <button
        onClick={onBegin}
        className="w-full h-12 rounded-full bg-gradient-to-r from-[color:var(--cq-gold)] to-[color:var(--cq-gold-2)] text-[color:var(--cq-ink)] font-semibold text-sm hover:shadow-lg transition"
      >
        {missionLabels.beginMission[language]}
      </button>
    </div>
  );
}
