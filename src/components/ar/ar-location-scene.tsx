'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/language';
import { ARPermission } from './ar-permission';
import { ARNarrativeCard } from './ar-narrative-card';
import { ARAnnotation } from './ar-annotation';
import { ARError } from './ar-error';
import { ARLoading } from './ar-loading';

interface ARLocationSceneProps {
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

type ARState = 'permission' | 'loading' | 'active' | 'narrative' | 'error';

export function ARLocationScene({ poiId, narrative, annotations = [], onClose, onAnswerQuiz }: ARLocationSceneProps) {
  const { language } = useLanguage();
  const [arState, setARState] = useState<ARState>('permission');
  const [currentNarrativeIndex, setCurrentNarrativeIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasError, setHasError] = useState(false);

  const cleanupCamera = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
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
    setHasError(false);

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      
      loadingTimeoutRef.current = setTimeout(() => {
        setARState('narrative');
      }, 1500);
    } catch (err) {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      console.error('Camera error:', err);
      setHasError(true);
      setARState('error');
    }
  }, []);

  useEffect(() => {
    if ((arState === 'narrative' || arState === 'active') && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.error('Video play error:', err));
    }
  }, [arState]);

  const handlePermissionAllow = useCallback(() => {
    startCamera();
  }, [startCamera]);

  const handlePermissionDeny = useCallback(() => {
    setARState('error');
  }, []);

  const handleNarrativeClose = useCallback(() => {
    setARState('active');
  }, []);

  const handleNarrativeContinue = useCallback(() => {
    if (currentNarrativeIndex < narrative.hints.length) {
      setCurrentNarrativeIndex(prev => prev + 1);
    } else {
      setARState('active');
    }
  }, [currentNarrativeIndex, narrative.hints.length]);

  const handleRetry = useCallback(() => {
    cleanupCamera();
    setTimeout(() => startCamera(), 300);
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
      {arState === 'loading' && <ARLoading message={{ zh: '正在启动相机...', en: 'Starting camera...' }} />}

      {/* 相机画面 + UI (narrative 和 active 状态) */}
      {(arState === 'narrative' || arState === 'active') && (
        <>
          {/* 相机画面 - 全屏背景 */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="fixed inset-0 w-full h-full object-cover z-10 bg-black"
            style={{ transform: 'scale(1.01)' }}
          />
          
          {/* 叠加在相机画面上的UI */}
          <div className="fixed inset-0 z-20 pointer-events-none">
            {/* 顶部操作栏 */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition"
              >
                ✕
              </button>
              <button
                onClick={handleFallback}
                className="px-4 h-10 rounded-full bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] text-sm font-semibold hover:bg-[color:var(--cq-gold-2)] transition"
              >
                {language === 'zh' ? '返回答题' : 'Answer Quiz'}
              </button>
            </div>
          </div>

          {/* 叙事卡片 - 底部弹出 (仅在narrative状态显示) */}
          {arState === 'narrative' && (
            <div className="pointer-events-auto">
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
            </div>
          )}

          {/* 关键点标注 (仅在active状态显示) */}
          {arState === 'active' && annotations.map((ann) => (
            <ARAnnotation
              key={ann.id}
              label={ann.label}
              icon="📍"
              position={ann.position}
              popup={ann.popup}
            />
          ))}

          {/* 底部提示 (仅在active状态显示) */}
          {arState === 'active' && (
            <div className="fixed bottom-6 left-4 right-4 pointer-events-auto">
              <div className="p-4 bg-black/60 backdrop-blur-sm rounded-2xl text-white text-sm text-center">
                {language === 'zh'
                  ? '点击标注点查看详细信息，或点击返回答题'
                  : 'Tap annotations for details, or return to answer the quiz'}
              </div>
            </div>
          )}
        </>
      )}

      {/* 错误提示 */}
      {arState === 'error' && (
        <ARError
          type="camera"
          message={{
            zh: hasError 
              ? '相机无法访问。请检查浏览器相机权限设置，或继续使用答题功能。'
              : '相机启动超时。请检查权限设置，或继续使用答题功能。',
            en: hasError 
              ? 'Camera unavailable. Please check browser permissions, or continue with the quiz.'
              : 'Camera startup timed out. Please check permissions, or continue with the quiz.',
          }}
          onRetry={handleRetry}
          onFallback={handleFallback}
        />
      )}
    </>
  );
}
