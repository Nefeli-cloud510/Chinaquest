'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setARState('loading');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setTimeout(() => {
        setARState('scanning');
      }, 1000);
    } catch (err) {
      console.error('Camera error:', err);
      setARState('error');
    }
  }, []);

  const handlePermissionAllow = useCallback(() => {
    startCamera();
  }, [startCamera]);

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
    cleanupCamera();
    startCamera();
  }, [cleanupCamera, startCamera]);

  const handleFallback = useCallback(() => {
    cleanupCamera();
    onAnswerQuiz();
  }, [cleanupCamera, onAnswerQuiz]);

  const handleClose = useCallback(() => {
    cleanupCamera();
    onClose();
  }, [cleanupCamera, onClose]);

  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, [cleanupCamera]);

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
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="fixed inset-0 w-full h-full object-cover z-30"
          />
          <ARScanningGuide onDetected={handleScanningDone} />
        </>
      )}

      {/* AR活跃场景 */}
      {arState === 'active' && (
        <div className="fixed inset-0 z-40">
          {/* 相机画面 */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 顶部操作栏 */}
          <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60"
            >
              <span className="text-lg">✕</span>
            </button>
            <button
              onClick={handleFallback}
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
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="fixed inset-0 w-full h-full object-cover z-30"
          />
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
        </>
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
