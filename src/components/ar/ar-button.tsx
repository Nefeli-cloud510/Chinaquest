'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';

interface ARButtonProps {
  onEnterAR: () => void;
  disabled?: boolean;
  className?: string;
}

const buttonLabels = {
  enterAR: { zh: '使用相机探索', en: 'Explore with Camera' },
  arHint: { zh: 'AR互动将在下一阶段上线', en: 'AR interactions coming next phase' },
};

export function ARButton({ onEnterAR, disabled = false, className = '' }: ARButtonProps) {
  const { language } = useLanguage();
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onEnterAR}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center gap-2 rounded-full font-medium transition
          h-11 px-5 text-sm
          bg-gradient-to-r from-[color:var(--cq-gold)] to-[color:var(--cq-gold-2)] text-[color:var(--cq-ink)]
          hover:shadow-lg hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {/* AR图标 */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M2 8l4-4M22 8l-4-4M2 16l4 4M22 16l-4 4" />
        </svg>
        {buttonLabels.enterAR[language]}
      </button>

      {/* 提示气泡 */}
      {showHint && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[color:var(--cq-ink)] text-white text-xs rounded-lg whitespace-nowrap shadow-lg">
          {buttonLabels.arHint[language]}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-[color:var(--cq-ink)] rotate-45" />
          </div>
        </div>
      )}

      {/* 提示触发器 */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[color:var(--cq-muted)] text-white text-xs flex items-center justify-center hover:bg-[color:var(--cq-ink)]"
      >
        ?
      </button>
    </div>
  );
}
