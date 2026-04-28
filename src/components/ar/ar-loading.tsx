'use client';

import { useLanguage } from '@/lib/language';

interface ARLoadingProps {
  message?: { zh: string; en: string };
}

const loadingLabels = {
  default: { zh: '正在加载AR场景...', en: 'Loading AR Scene...' },
  modelLoading: { zh: '加载3D模型...', en: 'Loading 3D Models...' },
  preparing: { zh: '准备体验...', en: 'Preparing Experience...' },
};

export function ARLoading({ message }: ARLoadingProps) {
  const { language } = useLanguage();
  const text = message || loadingLabels.default;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* 加载动画 */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-[color:var(--cq-gold)] rounded-full animate-spin" />
          {/* 中心图标 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">📱</span>
          </div>
        </div>

        {/* 加载文字 */}
        <p className="mt-4 text-sm text-white font-medium">
          {text[language]}
        </p>

        {/* 进度点动画 */}
        <div className="mt-3 flex justify-center gap-1.5">
          <div className="w-2 h-2 bg-[color:var(--cq-gold)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[color:var(--cq-gold)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[color:var(--cq-gold)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
