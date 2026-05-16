'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { getImagePath } from '@/lib/image-utils';
import type { Flashcard } from '@/lib/flashcards';

interface FlashcardDisplayProps {
  flashcard: Flashcard;
  onCollectClue?: (clueId: string) => void;
  collectedClues?: string[];
  onEnterAR?: () => void;
  className?: string;
}

export function FlashcardDisplay({
  flashcard,
  onCollectClue,
  collectedClues = [],
  onEnterAR,
  className = '',
}: FlashcardDisplayProps) {
  const { language } = useLanguage();
  const [showBack, setShowBack] = useState(false);
  const [expandedClue, setExpandedClue] = useState<string | null>(null);

  const collectedCount = flashcard.clues.filter(c => collectedClues.includes(c.id)).length;
  const totalClues = flashcard.clues.length;

  return (
    <div className={`relative ${className}`}>
      <div className="rounded-3xl border border-[color:var(--cq-border)] bg-[color:var(--cq-surface)] overflow-hidden shadow-[0_12px_32px_var(--cq-shadow)]">
        {/* 闪卡头部 */}
        <div className="relative overflow-hidden">
          {flashcard.imageUrl ? (
            <img
              src={getImagePath(flashcard.imageUrl)}
              alt={flashcard.title[language]}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-[color:var(--cq-ink)] to-[color:var(--cq-gold)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="text-white/80 text-xs font-medium">
              {flashcard.subtitle[language]}
            </div>
            <h3 className="text-white text-xl font-semibold">
              {flashcard.title[language]}
            </h3>
          </div>
          {/* 线索收集进度 */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
            🔍 {collectedCount}/{totalClues}
          </div>
        </div>

        {/* 闪卡内容 */}
        <div className="p-5">
          <p className="text-sm text-[color:var(--cq-muted)] leading-relaxed line-clamp-4">
            {flashcard.narrative[language]}
          </p>

          {/* 线索列表 */}
          {flashcard.clues.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium text-[color:var(--cq-muted)] uppercase tracking-wider">
                {language === 'zh' ? '可收集线索' : 'Collectible Clues'}
              </div>
              {flashcard.clues.map(clue => {
                const isCollected = collectedClues.includes(clue.id);
                const isExpanded = expandedClue === clue.id;
                return (
                  <button
                    key={clue.id}
                    onClick={() => {
                      if (!isCollected && onCollectClue) {
                        onCollectClue(clue.id);
                      }
                      setExpandedClue(isExpanded ? null : clue.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      isCollected
                        ? 'border-[color:var(--cq-gold)] bg-[color:var(--cq-gold)]/10'
                        : 'border-[color:var(--cq-border)] hover:border-[color:var(--cq-gold)]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{clue.icon}</span>
                      <span className="text-sm font-medium text-[color:var(--cq-text)]">
                        {clue.title[language]}
                      </span>
                      <span className="ml-auto text-xs">
                        {isCollected ? '✅' : '🔒'}
                      </span>
                    </div>
                    {isExpanded && isCollected && (
                      <p className="mt-2 text-xs text-[color:var(--cq-muted)] leading-relaxed">
                        {clue.content[language]}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-4 flex gap-3">
            {onEnterAR && (
              <button
                onClick={onEnterAR}
                className="flex-1 h-10 rounded-full bg-[color:var(--cq-ink)] text-white text-sm font-medium hover:bg-black/85 transition"
              >
                {language === 'zh' ? '📱 AR探索' : '📱 AR Explore'}
              </button>
            )}
            <button
              onClick={() => setShowBack(!showBack)}
              className="flex-1 h-10 rounded-full border border-[color:var(--cq-border)] text-[color:var(--cq-text)] text-sm font-medium hover:bg-black/5 transition"
            >
              {showBack 
                ? (language === 'zh' ? '正面' : 'Front') 
                : (language === 'zh' ? '背面详情' : 'Details')
              }
            </button>
          </div>

          {/* 背面内容 */}
          {showBack && (
            <div className="mt-4 p-4 bg-[color:var(--cq-surface-2)] rounded-2xl">
              <p className="text-sm text-[color:var(--cq-muted)] leading-relaxed">
                {flashcard.narrative[language]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
