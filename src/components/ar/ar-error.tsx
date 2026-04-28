'use client';

import { useLanguage } from '@/lib/language';

interface ARErrorProps {
  title?: { zh: string; en: string };
  message: { zh: string; en: string };
  onRetry?: () => void;
  onFallback?: () => void;
  type?: 'camera' | 'ar' | 'network' | 'generic';
}

const errorConfig = {
  camera: {
    icon: '📷',
    title: { zh: '相机无法访问', en: 'Camera Unavailable' },
    message: { 
      zh: '请检查浏览器相机权限设置，确保允许访问相机。', 
      en: 'Please check your browser camera permissions and allow access.' 
    },
  },
  ar: {
    icon: '🔍',
    title: { zh: 'AR识别失败', en: 'AR Recognition Failed' },
    message: { 
      zh: '无法识别当前场景。请尝试移动位置或调整光线角度。', 
      en: 'Unable to recognize the current scene. Try moving or adjusting the lighting angle.' 
    },
  },
  network: {
    icon: '🌐',
    title: { zh: '网络连接问题', en: 'Network Connection Issue' },
    message: { 
      zh: '网络连接不稳定，请检查网络后重试。您仍可以继续使用答题功能。', 
      en: 'Network connection is unstable. Please check and try again. You can still use the quiz feature.' 
    },
  },
  generic: {
    icon: '⚠️',
    title: { zh: '出现问题', en: 'Something Went Wrong' },
    message: { 
      zh: 'AR体验暂时无法使用，但您可以继续完成答题环节。', 
      en: 'AR experience is temporarily unavailable, but you can still complete the quiz.' 
    },
  },
};

const errorLabels = {
  retry: { zh: '重试', en: 'Retry' },
  continueWithoutAR: { zh: '继续答题', en: 'Continue Quiz' },
  backToSite: { zh: '返回首页', en: 'Back to Home' },
};

export function ARError({ 
  title, 
  message, 
  onRetry, 
  onFallback,
  type = 'generic' 
}: ARErrorProps) {
  const { language } = useLanguage();
  const config = errorConfig[type];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[color:var(--cq-surface)] rounded-3xl p-6 shadow-xl border border-[color:var(--cq-border)] text-center">
        {/* 错误图标 */}
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">{config.icon}</span>
        </div>

        {/* 标题 */}
        <h3 className="mt-4 text-lg font-semibold text-[color:var(--cq-text)]">
          {title ? title[language] : config.title[language]}
        </h3>

        {/* 错误信息 */}
        <p className="mt-2 text-sm text-[color:var(--cq-muted)] leading-relaxed">
          {message[language] || config.message[language]}
        </p>

        {/* 操作按钮 */}
        <div className="mt-6 space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full h-11 rounded-full bg-[color:var(--cq-ink)] text-white text-sm font-medium hover:bg-black/85 transition"
            >
              {errorLabels.retry[language]}
            </button>
          )}
          {onFallback && (
            <button
              onClick={onFallback}
              className="w-full h-11 rounded-full bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] text-sm font-semibold hover:bg-[color:var(--cq-gold-2)] transition"
            >
              {errorLabels.continueWithoutAR[language]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
