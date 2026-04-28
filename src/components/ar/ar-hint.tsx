'use client';

import { useLanguage } from '@/lib/language';

interface ARHintProps {
  text: { zh: string; en: string };
  onAnswerQuiz?: () => void;
  onClose?: () => void;
}

const hintLabels = {
  answerQuiz: { zh: '返回答题', en: 'Answer Quiz' },
  close: { zh: '关闭', en: 'Close' },
};

export function ARHint({ text, onAnswerQuiz, onClose }: ARHintProps) {
  const { language } = useLanguage();

  return (
    <div className="fixed top-4 left-4 right-4 z-40">
      <div className="p-4 bg-[color:var(--cq-ink)]/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10">
        {/* 提示图标和文字 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[color:var(--cq-gold)] flex items-center justify-center">
            <span className="text-base">💡</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white leading-relaxed">
              {text[language]}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
            >
              <span className="text-white text-xs">✕</span>
            </button>
          )}
        </div>

        {/* 答题按钮 */}
        {onAnswerQuiz && (
          <button
            onClick={onAnswerQuiz}
            className="mt-3 w-full h-10 rounded-full bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] text-sm font-semibold hover:bg-[color:var(--cq-gold-2)] transition"
          >
            {hintLabels.answerQuiz[language]}
          </button>
        )}
      </div>
    </div>
  );
}
