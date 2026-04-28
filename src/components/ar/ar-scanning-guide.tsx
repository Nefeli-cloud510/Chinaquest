'use client';

import { useLanguage } from '@/lib/language';
import { useEffect, useState } from 'react';

interface ARScanningGuideProps {
  onDetected?: () => void;
  timeout?: number;
}

const scanningLabels = {
  title: { zh: '正在扫描场景...', en: 'Scanning Scene...' },
  hint: { zh: '请缓慢移动手机，让相机看到周围环境', en: 'Move your phone slowly to let the camera see the surroundings' },
  searching: { zh: '寻找特征点...', en: 'Searching for features...' },
  aligning: { zh: '对齐场景中...', en: 'Aligning to scene...' },
  tip: { zh: '提示：确保光线充足，避免遮挡相机', en: 'Tip: Ensure good lighting and avoid blocking the camera' },
};

export function ARScanningGuide({ onDetected, timeout = 30000 }: ARScanningGuideProps) {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'searching' | 'aligning'>('searching');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onDetected?.();
          return 100;
        }
        const next = prev + 2;
        if (next > 50) setPhase('aligning');
        return next;
      });
    }, 100);

    const timeoutId = setTimeout(() => {
      onDetected?.();
    }, timeout);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [onDetected, timeout]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6">
      {/* 扫描框 */}
      <div className="relative w-64 h-64">
        {/* 四角标记 */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[color:var(--cq-gold)]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[color:var(--cq-gold)]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[color:var(--cq-gold)]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[color:var(--cq-gold)]" />
        
        {/* 中心扫描线动画 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[color:var(--cq-gold)] to-transparent animate-pulse" />
        </div>
      </div>

      {/* 标题 */}
      <h3 className="mt-8 text-lg font-semibold text-white">
        {scanningLabels.title[language]}
      </h3>

      {/* 提示文字 */}
      <p className="mt-2 text-sm text-white/70 text-center">
        {scanningLabels.hint[language]}
      </p>

      {/* 进度条 */}
      <div className="mt-6 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[color:var(--cq-gold)] rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 阶段状态 */}
      <p className="mt-3 text-xs text-white/50">
        {phase === 'searching' ? scanningLabels.searching[language] : scanningLabels.aligning[language]}
      </p>

      {/* 底部提示 */}
      <div className="mt-8 px-4 py-3 rounded-2xl bg-white/10">
        <p className="text-xs text-white/80 text-center">
          {scanningLabels.tip[language]}
        </p>
      </div>
    </div>
  );
}
