'use client';

import { useLanguage } from '@/lib/language';
import { useState } from 'react';

interface ARPermissionProps {
  onAllow: () => void;
  onDeny: () => void;
}

const permissionLabels = {
  title: { zh: '需要相机权限', en: 'Camera Permission Required' },
  description: { 
    zh: 'AR体验需要使用您的相机来识别周围环境。我们不会存储或上传任何相机画面，所有处理都在您的设备上本地完成。', 
    en: 'AR experience requires your camera to recognize the surrounding environment. We do not store or upload any camera footage—all processing is done locally on your device.' 
  },
  whyNeeded: { zh: '为什么需要相机？', en: 'Why do we need the camera?' },
  whyAnswer: { 
    zh: '相机帮助我们识别您所在的真实场景，并将虚拟内容准确地叠加到现实世界中，为您创造沉浸式的文化探索体验。', 
    en: 'The camera helps us identify your real-world location and accurately overlay virtual content onto the physical world, creating an immersive cultural exploration experience.' 
  },
  privacy: { zh: '隐私保护', en: 'Privacy Protection' },
  privacyAnswer: { 
    zh: '您的相机画面仅在本地处理，不会被上传或存储。我们严格遵守隐私保护法规。', 
    en: 'Your camera footage is only processed locally and is never uploaded or stored. We strictly comply with privacy protection regulations.' 
  },
  allow: { zh: '允许使用相机', en: 'Allow Camera Access' },
  deny: { zh: '暂不使用', en: 'Not Now' },
};

export function ARPermission({ onAllow, onDeny }: ARPermissionProps) {
  const { language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-[color:var(--cq-surface)] rounded-t-3xl sm:rounded-3xl p-6 shadow-xl border border-[color:var(--cq-border)]">
        {/* 顶部指示条 */}
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 图标和标题 */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[color:var(--cq-gold)]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[color:var(--cq-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[color:var(--cq-text)]">
            {permissionLabels.title[language]}
          </h3>
        </div>

        {/* 描述 */}
        <p className="text-sm text-[color:var(--cq-muted)] text-center leading-relaxed">
          {permissionLabels.description[language]}
        </p>

        {/* 详情展开 */}
        {showDetails && (
          <div className="mt-4 p-4 bg-[color:var(--cq-bg)] rounded-2xl space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-[color:var(--cq-text)]">
                {permissionLabels.whyNeeded[language]}
              </h4>
              <p className="mt-1 text-xs text-[color:var(--cq-muted)]">
                {permissionLabels.whyAnswer[language]}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[color:var(--cq-text)]">
                {permissionLabels.privacy[language]}
              </h4>
              <p className="mt-1 text-xs text-[color:var(--cq-muted)]">
                {permissionLabels.privacyAnswer[language]}
              </p>
            </div>
          </div>
        )}

        {/* 更多信息按钮 */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 text-xs text-[color:var(--cq-gold)] font-medium hover:underline"
        >
          {showDetails 
            ? (language === 'zh' ? '收起详情' : 'Hide Details') 
            : (language === 'zh' ? '了解更多' : 'Learn More')
          }
        </button>

        {/* 操作按钮 */}
        <div className="mt-4 space-y-3">
          <button
            onClick={onAllow}
            className="w-full h-12 rounded-full bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] font-semibold text-sm hover:bg-[color:var(--cq-gold-2)] transition"
          >
            {permissionLabels.allow[language]}
          </button>
          <button
            onClick={onDeny}
            className="w-full h-12 rounded-full bg-[color:var(--cq-bg)] text-[color:var(--cq-muted)] text-sm font-medium hover:bg-gray-100 transition"
          >
            {permissionLabels.deny[language]}
          </button>
        </div>
      </div>
    </div>
  );
}
