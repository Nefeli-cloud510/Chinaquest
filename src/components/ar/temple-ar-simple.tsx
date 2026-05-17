'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';

interface TempleARSimpleProps {
  onDetected?: () => void;
  onClose: () => void;
}

type ARState = 'welcome' | 'loading' | 'scanning' | 'detected' | 'error';

const labels = {
  title: { zh: '天坛 AR 扫描', en: 'Temple AR Scan' },
  description: {
    zh: '请使用天坛专属识别图进行扫描。当前版本已接入网站正式入口，优先保证识别与模型显示稳定。',
    en: 'Scan the custom Temple marker. This version is connected to the main site entry and prioritizes stable recognition.',
  },
  start: { zh: '开始天坛扫描', en: 'Start Temple Scan' },
  close: { zh: '关闭', en: 'Close' },
  loading: { zh: '正在打开 AR 页面...', en: 'Opening AR scene...' },
  scanning: {
    zh: '全屏区域都可参与识别。请将天坛识别图放入画面内并保持稳定，识别成功后会显示天坛模型。',
    en: 'The whole screen can recognize the marker. Keep the Temple marker inside the camera view to show the model.',
  },
  detected: { zh: '已识别到天坛识别图', en: 'Temple marker detected' },
  lost: { zh: '标记已离开画面', en: 'Marker lost from view' },
  sceneLoaded: {
    zh: 'AR 场景已加载，正在等待相机与天坛识别图。',
    en: 'AR scene loaded. Waiting for the camera and the Temple marker.',
  },
  modelLoaded: {
    zh: '天坛模型已加载；识别成功后会显示模型，并可点击开始对话。',
    en: 'Temple model loaded. The model will appear after recognition, and you can tap to start the dialogue.',
  },
  loadFailed: { zh: 'AR 页面加载失败，请刷新重试。', en: 'AR page failed to load. Please refresh and retry.' },
  cameraHint: {
    zh: '如果没有弹出相机权限，请检查浏览器地址栏中的摄像头授权。',
    en: 'If camera permission does not appear, check browser camera permissions.',
  },
  overlayTitle: { zh: '天坛 AR 扫描中', en: 'Temple AR Scanning' },
  overlayDetected: { zh: '识别成功，天坛 AR 已进入可用状态', en: 'Recognition succeeded and Temple AR is ready' },
  markerHint: {
    zh: '当前版本使用独立 AR 页面承载正式识别场景，优先保证稳定性。',
    en: 'This version uses a standalone AR page to maximize stability for the production marker scene.',
  },
};

export function TempleARSimple({ onDetected, onClose }: TempleARSimpleProps) {
  const { language } = useLanguage();
  const [arState, setARState] = useState<ARState>('welcome');
  const [debugInfo, setDebugInfo] = useState(labels.cameraHint.zh);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredDetectedRef = useRef(false);

  const requestFullscreenIfPossible = async () => {
    const element = containerRef.current;
    if (!element || document.fullscreenElement) {
      return;
    }

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen failures on browsers that block it.
    }
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('chinaquest-ar-visibility', { detail: { hidden: true } })
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data;
      if (!data || data.source !== 'chinaquest-ar') {
        return;
      }

      switch (data.type) {
        case 'scene-loaded':
          setDebugInfo(labels.sceneLoaded[language]);
          break;
        case 'model-loaded':
          setDebugInfo(labels.modelLoaded[language]);
          break;
        case 'marker-found':
          setARState('detected');
          setDebugInfo(labels.detected[language]);
          if (!hasTriggeredDetectedRef.current) {
            hasTriggeredDetectedRef.current = true;
            onDetected?.();
          }
          break;
        case 'marker-lost':
          setARState('scanning');
          setDebugInfo(labels.lost[language]);
          break;
        case 'error':
          setARState('error');
          setDebugInfo(typeof data.detail === 'string' ? data.detail : labels.loadFailed[language]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.dispatchEvent(
        new CustomEvent('chinaquest-ar-visibility', { detail: { hidden: false } })
      );
      window.removeEventListener('message', handleMessage);
    };
  }, [language, onDetected]);

  const startAR = async () => {
    hasTriggeredDetectedRef.current = false;
    await requestFullscreenIfPossible();
    setARState('scanning');
    setDebugInfo(labels.cameraHint[language]);
  };

  const handleClose = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // Ignore exit failures.
      }
    }
    onClose();
  };

  const iframeSrc = `../ar/hiro-temple.html?lang=${language}`;

  if (arState === 'loading' || arState === 'welcome' || arState === 'error') {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">Hiro</div>
          <h3 className="text-xl font-semibold mb-2">{labels.title[language]}</h3>
          <p className="text-sm text-gray-600 mb-3 max-w-md mx-auto">{labels.description[language]}</p>
          <p className="text-xs text-gray-500 mb-6 max-w-md mx-auto">{labels.markerHint[language]}</p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={startAR}
              disabled={arState === 'loading'}
              className={`px-6 py-3 rounded-full font-semibold ${
                arState !== 'loading'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {arState === 'loading' ? labels.loading[language] : labels.start[language]}
            </button>

            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300"
            >
              {labels.close[language]}
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600 text-left font-mono">
            {debugInfo}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 h-full w-full overflow-hidden bg-black"
    >
      <iframe
        ref={iframeRef}
        title="ChinaQuest Temple AR"
        src={iframeSrc}
        allow="camera; microphone; fullscreen"
        className="absolute inset-0 h-full w-full border-0 bg-black"
        onLoad={() => {
          setDebugInfo(labels.scanning[language]);
        }}
      />

      <div className="absolute top-4 left-4 right-16 z-[60]">
        <div className="rounded-2xl bg-black/65 px-4 py-3 text-white backdrop-blur-sm">
          <div className="text-sm font-semibold">{labels.overlayTitle[language]}</div>
          <div className="mt-1 text-xs text-white/80">{debugInfo}</div>
          <div className="mt-1 text-xs text-white/60">
            {arState === 'detected' ? labels.overlayDetected[language] : labels.scanning[language]}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[55] flex items-center justify-center">
        <div className="absolute inset-3 rounded-[32px] border-2 border-white/35" />
        <div className="absolute inset-6 rounded-[28px] border border-white/15" />
        <div className="absolute left-6 top-6 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white/80">
          {language === 'zh' ? '全屏可识别' : 'Full-screen detection'}
        </div>
      </div>

      <button
        onClick={handleClose}
        className="absolute right-4 top-4 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
      >
        ✕
      </button>
    </div>
  );
}
