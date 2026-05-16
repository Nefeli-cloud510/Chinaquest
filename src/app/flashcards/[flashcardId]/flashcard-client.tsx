'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { SiteShell } from '@/components/shell';
import { Button, Card } from '@/components/ui';
import { getFlashcardById, collectClue, getCollectedClues, hasCollectedClue } from '@/lib/flashcards';
import { FlashcardDisplay } from '@/components/ar/flashcard-display';
import type { Flashcard } from '@/lib/flashcards';

export default function FlashcardClient({ flashcardId }: { flashcardId: string }) {
  const { language } = useLanguage();
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const [collectedClues, setCollectedClues] = useState<string[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const card = getFlashcardById(flashcardId);
    if (!card) {
      setNotFound(true);
      return;
    }
    setFlashcard(card);
    setCollectedClues(getCollectedClues());
  }, [flashcardId]);

  const handleCollectClue = (clueId: string) => {
    if (!hasCollectedClue(clueId)) {
      collectClue(clueId);
      setCollectedClues(getCollectedClues());
    }
  };

  const labels = {
    notFound: { zh: '闪卡未找到', en: 'Flashcard Not Found' },
    notFoundDesc: { zh: '此闪卡可能已失效或不存在。', en: 'This flashcard may be invalid or no longer exists.' },
    backToRoute: { zh: '返回路线', en: 'Back to Route' },
  };

  if (notFound || !flashcard) {
    return (
      <SiteShell active="routes">
        <Card>
          <h1 className="text-2xl font-semibold">{labels.notFound[language]}</h1>
          <p className="mt-2 text-sm text-[color:var(--cq-muted)]">
            {labels.notFoundDesc[language]}
          </p>
          <div className="mt-4">
            <Button href="/routes" variant="secondary">
              {labels.backToRoute[language]}
            </Button>
          </div>
        </Card>
      </SiteShell>
    );
  }

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <FlashcardDisplay
          flashcard={flashcard}
          onCollectClue={handleCollectClue}
          collectedClues={collectedClues}
          onEnterAR={() => {
            window.location.href = `/poi/${flashcard.poiId}`;
          }}
        />
        
        <Card>
          <div className="text-sm text-[color:var(--cq-muted)]">
            {language === 'zh' 
              ? '扫描实体卡片上的二维码即可查看详细介绍和互动内容。'
              : 'Scan the QR code on the physical card to view detailed information and interact.'}
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
