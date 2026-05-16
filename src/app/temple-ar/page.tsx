'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { SiteShell } from '@/components/shell';
import { Button, Card } from '@/components/ui';
import { TempleOfHeavenAR } from '@/components/ar/temple-of-heaven-ar';

const pageLabels = {
  title: { zh: '天坛 AR 体验', en: 'Temple of Heaven AR Experience' },
  description: { 
    zh: '使用摄像头扫描天坛透卡，与天坛进行互动！', 
    en: 'Use your camera to scan the Temple of Heaven card and interact with it!' 
  },
  startAR: { zh: '开始 AR 体验', en: 'Start AR Experience' },
  howToUse: { zh: '使用说明', en: 'How to Use' },
  steps: {
    zh: [
      '准备天坛透卡（印有祈年殿图案的透明卡片）',
      '点击"开始 AR 体验"按钮',
      '允许浏览器访问摄像头',
      '将透卡对准摄像头，保持光线充足',
      '识别成功后，天坛会和你对话！'
    ],
    en: [
      'Prepare the Temple of Heaven transparent card (with the Hall of Prayer pattern)',
      'Click "Start AR Experience" button',
      'Allow browser to access camera',
      'Point the card at the camera in good lighting',
      'When recognized, the Temple will talk to you!'
    ]
  },
  tips: {
    zh: '提示：确保光线充足，透卡图案清晰，摄像头对焦准确。',
    en: 'Tip: Ensure good lighting, clear card pattern, and accurate camera focus.'
  }
};

export default function TempleOfHeavenPage() {
  const { language } = useLanguage();
  const [showAR, setShowAR] = useState(false);

  if (showAR) {
    return <TempleOfHeavenAR onClose={() => setShowAR(false)} />;
  }

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        {/* 标题卡片 */}
        <Card>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏛️</div>
            <h1 className="text-3xl font-semibold mb-3">
              {pageLabels.title[language]}
            </h1>
            <p className="text-gray-600 mb-6">
              {pageLabels.description[language]}
            </p>
            <button
              onClick={() => setShowAR(true)}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-full font-semibold hover:from-red-700 hover:to-yellow-700 transition shadow-lg"
            >
              {pageLabels.startAR[language]}
            </button>
          </div>
        </Card>

        {/* 使用说明 */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">
            {pageLabels.howToUse[language]}
          </h2>
          <ol className="space-y-3">
            {pageLabels.steps[language].map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-start gap-2">
              <span className="text-xl">💡</span>
              <p className="text-sm text-yellow-800">
                {pageLabels.tips[language]}
              </p>
            </div>
          </div>
        </Card>

        {/* 透卡预览 */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">
            {language === 'zh' ? '你的透卡长这样' : 'Your Card Looks Like This'}
          </h2>
          <div className="aspect-[3/4] max-w-xs mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-gray-300 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🏛️</div>
              <p className="text-sm text-gray-500">
                {language === 'zh' 
                  ? '天坛祈年殿图案\n（请准备实体透卡）' 
                  : 'Temple of Heaven Pattern\n(Prepare physical card)'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
