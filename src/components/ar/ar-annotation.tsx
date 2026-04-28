'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';

interface ARAnnotationProps {
  label: { zh: string; en: string };
  popup?: { title: { zh: string; en: string }; content: { zh: string; en: string } };
  icon?: string;
  position?: { x: number; y: number };
  onClick?: () => void;
}

export function ARAnnotation({ label, popup, icon, position, onClick }: ARAnnotationProps) {
  const { language } = useLanguage();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div 
      className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
      style={position ? { left: `${position.x}%`, top: `${position.y}%` } : {}}
    >
      {/* 标注点 */}
      <button
        onClick={() => {
          if (popup) {
            setShowPopup(!showPopup);
          } else {
            onClick?.();
          }
        }}
        className="relative group"
      >
        {/* 脉冲动画圈 */}
        <div className="absolute inset-0 -m-2">
          <div className="w-12 h-12 rounded-full bg-[color:var(--cq-gold)]/30 animate-ping" />
        </div>
        
        {/* 图标 */}
        <div className="relative w-8 h-8 rounded-full bg-[color:var(--cq-gold)] flex items-center justify-center shadow-lg">
          <span className="text-lg">{icon || '📍'}</span>
        </div>

        {/* 标签 */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            {label[language]}
          </span>
        </div>
      </button>

      {/* 弹出详情 */}
      {showPopup && popup && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-[color:var(--cq-surface)] rounded-2xl shadow-xl border border-[color:var(--cq-border)]">
          <h5 className="text-sm font-semibold text-[color:var(--cq-text)]">
            {popup.title[language]}
          </h5>
          <p className="mt-1 text-xs text-[color:var(--cq-muted)] leading-relaxed">
            {popup.content[language]}
          </p>
          {/* 箭头 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-[color:var(--cq-surface)] border-r border-b border-[color:var(--cq-border)] rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}
