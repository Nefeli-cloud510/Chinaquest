'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';
import { QRScanner } from './qr-scanner';
import { FlashcardDisplay } from './flashcard-display';
import { 
  getFlashcardsByPoi, 
  collectClue, 
  getCollectedClues,
  hasCollectedClue 
} from '@/lib/flashcards';
import type { Flashcard } from '@/lib/flashcards';

type ARFlashcardView = 'list' | 'scanner' | 'flashcard' | 'ar';

interface ARFlashcardManagerProps {
  poiId: string;
  quizUrl?: string;
}

export function ARFlashcardManager({ poiId, quizUrl }: ARFlashcardManagerProps) {
  const { language } = useLanguage();
  const [view, setView] = useState<ARFlashcardView>('list');
  const [activeFlashcard, setActiveFlashcard] = useState<Flashcard | null>(null);
  const [collectedClues, setCollectedClues] = useState<string[]>([]);

  const flashcards = getFlashcardsByPoi(poiId);

  const handleScan = useCallback((result: string) => {
    // 解析扫码结果，匹配对应的闪卡
    // 扫码结果可以是URL路径或闪卡ID
    let matchedCard: Flashcard | undefined;
    
    if (result.startsWith('/')) {
      // URL路径，匹配qrCodeUrl
      matchedCard = flashcards.find(f => f.qrCodeUrl === result);
    } else {
      // 直接是闪卡ID
      matchedCard = flashcards.find(f => f.id === result);
    }

    if (matchedCard) {
      setActiveFlashcard(matchedCard);
      setView('flashcard');
    } else {
      // 未匹配的二维码，尝试作为URL跳转
      if (result.startsWith('http')) {
        window.open(result, '_blank');
      }
    }
  }, [flashcards]);

  const handleCollectClue = useCallback((clueId: string) => {
    if (!hasCollectedClue(clueId)) {
      collectClue(clueId);
      setCollectedClues(getCollectedClues());
    }
  }, []);

  const handleEnterAR = useCallback(() => {
    if (activeFlashcard) {
      setView('ar');
    }
  }, [activeFlashcard]);

  const handleBackToList = useCallback(() => {
    setView('list');
    setActiveFlashcard(null);
  }, []);

  // 初始化已收集的线索
  useState(() => {
    setCollectedClues(getCollectedClues());
  });

  const labels = {
    title: { zh: 'AR 探索', en: 'AR Explore' },
    subtitle: { zh: '扫描二维码或在下方选择闪卡', en: 'Scan QR code or select a flashcard below' },
    scanQR: { zh: '📷 扫描二维码', en: '📷 Scan QR Code' },
    noFlashcards: { zh: '暂无闪卡', en: 'No flashcards available' },
    collectedClues: { zh: '已收集线索', en: 'Collected Clues' },
    continueQuiz: { zh: '继续答题', en: 'Continue to Quiz' },
  };

  // 扫码视图
  if (view === 'scanner') {
    return (
      <QRScanner
        onScan={handleScan}
        onClose={handleBackToList}
      />
    );
  }

  // 闪卡详情视图
  if (view === 'flashcard' && activeFlashcard) {
    return (
      <div className="grid gap-6">
        <button
          onClick={handleBackToList}
          className="text-sm text-[color:var(--cq-gold)] hover:underline"
        >
          ← {language === 'zh' ? '返回闪卡列表' : 'Back to flashcards'}
        </button>
        
        <FlashcardDisplay
          flashcard={activeFlashcard}
          onCollectClue={handleCollectClue}
          collectedClues={collectedClues}
          onEnterAR={handleEnterAR}
        />
      </div>
    );
  }

  // AR视图（后续可接入真实AR）
  if (view === 'ar' && activeFlashcard) {
    return (
      <div className="relative">
        <div className="text-sm text-[color:var(--cq-muted)] mb-4">
          {language === 'zh' ? 'AR模式 - 即将上线' : 'AR Mode - Coming Soon'}
        </div>
        <button
          onClick={handleBackToList}
          className="px-4 py-2 rounded-full bg-[color:var(--cq-ink)] text-white text-sm"
        >
          {language === 'zh' ? '返回' : 'Back'}
        </button>
      </div>
    );
  }

  // 闪卡列表视图
  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--cq-text)]">
              {labels.title[language]}
            </h2>
            <p className="text-xs text-[color:var(--cq-muted)] mt-1">
              {labels.subtitle[language]}
            </p>
          </div>
          <button
            onClick={() => setView('scanner')}
            className="h-10 px-4 rounded-full bg-[color:var(--cq-ink)] text-white text-sm font-medium hover:bg-black/85 transition"
          >
            {labels.scanQR[language]}
          </button>
        </div>
      </Card>

      {/* 已收集线索概览 */}
      {collectedClues.length > 0 && (
        <Card>
          <div className="text-sm font-semibold text-[color:var(--cq-text)]">
            {labels.collectedClues[language]} ({collectedClues.length})
          </div>
          {quizUrl && (
            <button
              onClick={() => window.location.href = quizUrl}
              className="mt-3 w-full h-10 rounded-full bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] text-sm font-semibold hover:bg-[color:var(--cq-gold-2)] transition"
            >
              {labels.continueQuiz[language]}
            </button>
          )}
        </Card>
      )}

      {/* 闪卡网格 */}
      {flashcards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {flashcards.map(flashcard => (
            <FlashcardDisplay
              key={flashcard.id}
              flashcard={flashcard}
              onCollectClue={handleCollectClue}
              collectedClues={collectedClues}
              onEnterAR={handleEnterAR}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center text-[color:var(--cq-muted)] py-8">
            {labels.noFlashcards[language]}
          </div>
        </Card>
      )}
    </div>
  );
}
