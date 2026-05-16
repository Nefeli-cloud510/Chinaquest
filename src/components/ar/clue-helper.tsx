'use client';

import { useLanguage } from '@/lib/language';
import { getCollectedClueObjects } from '@/lib/flashcards';
import { Card } from '@/components/ui';

interface ClueHelperProps {
  className?: string;
}

export function ClueHelper({ className = '' }: ClueHelperProps) {
  const { language } = useLanguage();
  const collectedClues = getCollectedClueObjects();

  if (collectedClues.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <div className="text-sm font-semibold text-[color:var(--cq-text)] mb-3">
        {language === 'zh' ? '💡 已收集的线索' : '💡 Collected Clues'}
      </div>
      <div className="space-y-2">
        {collectedClues.map(clue => (
          <div
            key={clue.id}
            className="p-3 rounded-xl bg-[color:var(--cq-gold)]/10 border border-[color:var(--cq-gold)]/30"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{clue.icon}</span>
              <span className="text-sm font-medium text-[color:var(--cq-text)]">
                {clue.title[language]}
              </span>
            </div>
            <p className="mt-1 text-xs text-[color:var(--cq-muted)] leading-relaxed">
              {clue.content[language]}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
