'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/language';
import { ARPermission } from './ar-permission';
import { ARScanningGuide } from './ar-scanning-guide';
import { ARNarrativeCard } from './ar-narrative-card';
import { ARHint } from './ar-hint';
import { ARAnnotation } from './ar-annotation';
import { ARError } from './ar-error';
import { ARLoading } from './ar-loading';

interface ARSceneProps {
  poiId: string;
  narrative: { intro: { zh: string; en: string }; hints: Array<{ zh: string; en: string }> };
  annotations?: Array<{
    id: string;
    label: { zh: string; en: string };
    position: { x: number; y: number };
    popup?: { title: { zh: string; en: string }; content: { zh: string; en: string } };
  }>;
  onClose: () => void;
  onAnswerQuiz: () => void;
}

type ARState = 
  | 'permission' 
  | 'loading' 
  | 'scanning' 
  | 'active' 
  | 'narrative' 
  | 'error'
  | 'success';

export function ARScene({ poiId, narrative, annotations = [], onClose, onAnswerQuiz }: ARSceneProps) {
  const { language } = useLanguage();
  const [arState, setARState] = useState<ARState>('permission');
  const [currentNarrativeIndex, setCurrentNarrativeIndex] = useState(0);
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  const handlePermissionAllow = useCallback(() => {
    setARState('loading');
    setTimeout(() => setARState('scanning'), 1500);
  }, []);

  const handlePermissionDeny = useCallback(() => {
    setARState('error');
  }, []);

  const handleScanningDone = useCallback(() => {
    setARState('narrative');
  }, []);

  const handleNarrativeClose = useCallback(() => {
    setARState('active');
  }, []);

  const handleNarrativeContinue = useCallback(() => {
    if (currentNarrativeIndex < narrative.hints.length - 1) {
      setCurrentNarrativeIndex(prev => prev + 1);
    } else {
      setARState('active');
    }
  }, [currentNarrativeIndex, narrative.hints.length]);

  const handleRetry = useCallback(() => {
    setARState('scanning');
  }, []);

  const handleFallback = useCallback(() => {
    onAnswerQuiz();
  }, [onAnswerQuiz]);

  return (
    <>
      {/* 权限请求 */}
      {arState === 'permission' && (
        <ARPermission onAllow={handlePermissionAllow} onDeny={handlePermissionDeny} />
      )}

      {/* 加载中 */}
      {arState === 'loading' && <ARLoading />}

      {/* 扫描引导 */}
      {arState === 'scanning' && (
        <ARScanningGuide onDetected={handleScanningDone} />
      )}

      {/* AR活跃场景 */}
      {arState === 'active' && (
        <div className="fixed inset-0 z-40 bg-black/50">
          {/* 相机背景（模拟） */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          
          {/* 顶部操作栏 */}
          <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60"
            >
              <span className="text-lg">✕</span>
            </button>
            <button
              onClick={onAnswerQuiz}
              className="px-4 h-10 rounded-full bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] text-sm font-semibold hover:bg-[color:var(--cq-gold-2)]"
            >
              {language === 'zh' ? '返回答题' : 'Answer Quiz'}
            </button>
          </div>

          {/* 关键点标注 */}
          {annotations.map((ann) => (
            <ARAnnotation
              key={ann.id}
              label={ann.label}
              icon="📍"
              position={ann.position}
              popup={ann.popup}
            />
          ))}

          {/* 底部提示 */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="p-4 bg-black/60 backdrop-blur-sm rounded-2xl text-white text-sm text-center">
              {language === 'zh' 
                ? '点击标注点查看详细信息，或点击返回答题' 
                : 'Tap annotations for details, or return to answer the quiz'}
            </div>
          </div>
        </div>
      )}

      {/* 叙事卡片 */}
      {arState === 'narrative' && (
        <ARNarrativeCard
          content={
            currentNarrativeIndex === 0 
              ? narrative.intro 
              : narrative.hints[currentNarrativeIndex - 1]
          }
          type={currentNarrativeIndex === 0 ? 'intro' : 'hint'}
          onClose={handleNarrativeClose}
          onContinue={handleNarrativeContinue}
        />
      )}

      {/* 错误提示 */}
      {arState === 'error' && (
        <ARError
          type="camera"
          message={{
            zh: '相机无法访问。请检查浏览器相机权限设置，或继续使用答题功能。',
            en: 'Camera unavailable. Please check browser permissions, or continue with the quiz.',
          }}
          onRetry={handleRetry}
          onFallback={handleFallback}
        />
      )}
    </>
  );
}
