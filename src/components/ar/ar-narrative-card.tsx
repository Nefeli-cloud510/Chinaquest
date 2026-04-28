'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';

interface ARNarrativeCardProps {
  title?: { zh: string; en: string };
  content: { zh: string; en: string };
  type: 'intro' | 'hint' | 'conclusion';
  onClose?: () => void;
  onContinue?: () => void;
}

const cardTypeConfig = {
  intro: {
    bg: 'bg-[color:var(--cq-ink)]',
    title: { zh: '背景故事', en: 'Background Story' },
    icon: '📖',
  },
  hint: {
    bg: 'bg-[color:var(--cq-gold)]',
    title: { zh: '线索提示', en: 'Clue Hint' },
    icon: '💡',
  },
  conclusion: {
    bg: 'bg-gradient-to-r from-[color:var(--cq-gold)] to-[color:var(--cq-gold-2)]',
    title: { zh: '探索发现', en: 'Discovery' },
    icon: '✨',
  },
};

export function ARNarrativeCard({
  title,
  content,
  type = 'intro',
  onClose,
  onContinue,
}: ARNarrativeCardProps) {
  const { language } = useLanguage();
  const config = cardTypeConfig[type];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-40 p-4 pb-6
      ${config.bg}
      rounded-t-3xl shadow-2xl
    `}>
      {/* 顶部指示条 */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-1 bg-white/30 rounded-full" />
      </div>

      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <h4 className="text-sm font-semibold text-white">
            {title ? title[language] : config.title[language]}
          </h4>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
          >
            <span className="text-white text-xs">✕</span>
          </button>
        )}
      </div>

      {/* 内容区域 */}
      <div className={`text-sm text-white/90 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
        {content[language]}
      </div>

      {/* 展开/收起按钮 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs text-white/60 font-medium hover:text-white/80"
      >
        {expanded 
          ? (language === 'zh' ? '收起' : 'Collapse') 
          : (language === 'zh' ? '展开阅读' : 'Read More')
        }
      </button>

      {/* 继续按钮 */}
      {onContinue && (
        <button
          onClick={onContinue}
          className="mt-4 w-full h-11 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition"
        >
          {language === 'zh' ? '继续探索' : 'Continue Exploring'}
        </button>
      )}
    </div>
  );
}
