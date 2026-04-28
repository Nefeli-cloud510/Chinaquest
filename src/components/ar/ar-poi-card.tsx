'use client';

import { useLanguage } from '@/lib/language';
import { withBasePath } from '@/lib/base-path';

interface ARPOICardProps {
  poiId: string;
  title: { zh: string; en: string };
  short: { zh: string; en: string };
  image?: string;
  isArrived?: boolean;
  onEnterAR: () => void;
  onStartQuiz: () => void;
}

const cardLabels = {
  arrived: { zh: '已到达', en: 'Arrived' },
  notArrived: { zh: '未到达', en: 'Not yet arrived' },
  startPuzzle: { zh: '开始解谜', en: 'Start Puzzle' },
  arExperience: { zh: 'AR体验', en: 'AR Experience' },
  stopOrder: { zh: '第{order}站', en: 'Stop {order}' },
};

export function ARPOICard({
  poiId,
  title,
  short,
  image,
  isArrived = false,
  onEnterAR,
  onStartQuiz,
}: ARPOICardProps) {
  const { language } = useLanguage();

  // 从poiId提取站点序号
  const stopOrder = poiId.includes('qianmen') ? '1' : poiId.includes('drum') ? '2' : '3';

  return (
    <div className="rounded-3xl border border-[color:var(--cq-border)] bg-[color:var(--cq-surface)] overflow-hidden shadow-[0_12px_32px_var(--cq-shadow)]">
      {/* 图片区域 */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={withBasePath(`/${image}`)}
            alt={title[language]}
            className="w-full h-full object-cover"
          />
          {/* 到达状态标签 */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
            isArrived 
              ? 'bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)]' 
              : 'bg-white/80 text-[color:var(--cq-muted)]'
          }`}>
            {isArrived ? cardLabels.arrived[language] : cardLabels.notArrived[language]}
          </div>
          {/* 站点序号 */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[color:var(--cq-ink)] text-white text-xs font-semibold">
            {cardLabels.stopOrder[language].replace('{order}', stopOrder)}
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-[color:var(--cq-text)]">
          {title[language]}
        </h3>
        <p className="mt-2 text-sm text-[color:var(--cq-muted)]">
          {short[language]}
        </p>

        {/* 操作按钮 */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={onEnterAR}
            disabled={!isArrived}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
              ${isArrived 
                ? 'bg-gradient-to-r from-[color:var(--cq-gold)] to-[color:var(--cq-gold-2)] text-[color:var(--cq-ink)] hover:shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {cardLabels.arExperience[language]}
          </button>
          
          <button
            onClick={onStartQuiz}
            disabled={!isArrived}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
              ${isArrived 
                ? 'bg-[color:var(--cq-ink)] text-white hover:bg-black/85' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {cardLabels.startPuzzle[language]}
          </button>
        </div>
      </div>
    </div>
  );
}
