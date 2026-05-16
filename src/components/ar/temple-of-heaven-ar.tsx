'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/language';
import { SimpleAR } from './simple-ar';

interface TempleOfHeavenARProps {
  onClose: () => void;
}

// 天坛的自我介绍内容
const templeDialogues = {
  zh: [
    {
      text: '你好！我是天坛，建于 1420 年，是明清两代皇帝祭天的地方。',
      duration: 5000,
    },
    {
      text: '我的主体建筑是祈年殿，高 38 米，完全用木结构建造，没有一根钉子！',
      duration: 5000,
    },
    {
      text: '你看我脚下的圜丘坛，所有数字都是 9 的倍数，因为 9 是最大的阳数。',
      duration: 5000,
    },
    {
      text: '每年冬至，皇帝会在这里举行祭天大典，祈求风调雨顺。',
      duration: 5000,
    },
  ],
  en: [
    {
      text: 'Hello! I am the Temple of Heaven, built in 1420. Emperors of the Ming and Qing dynasties offered sacrifices to Heaven here.',
      duration: 5000,
    },
    {
      text: 'My main building, the Hall of Prayer for Good Harvests, is 38 meters tall and built entirely with wood—without a single nail!',
      duration: 5000,
    },
    {
      text: 'Look at the Circular Mound Altar beneath my feet. All numbers here are multiples of 9, because 9 is the largest yang number.',
      duration: 5000,
    },
    {
      text: 'Every winter solstice, the emperor would hold a grand ceremony here to pray for good weather and harvests.',
      duration: 5000,
    },
  ],
};

export function TempleOfHeavenAR({ onClose }: TempleOfHeavenARProps) {
  const { language } = useLanguage();
  const [isDetected, setIsDetected] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);

  const handleDetected = useCallback(() => {
    setIsDetected(true);
    setShowDialogue(true);
    
    // 自动播放对话框
    const dialogues = templeDialogues[language];
    let index = 0;
    
    const playNext = () => {
      if (index < dialogues.length) {
        setCurrentDialogueIndex(index);
        index++;
        setTimeout(playNext, dialogues[index - 1].duration);
      } else {
        // 播放完毕
        setTimeout(() => setShowDialogue(false), 3000);
      }
    };
    
    playNext();
  }, [language]);

  const dialogues = templeDialogues[language];
  const currentDialogue = dialogues[currentDialogueIndex];

  return (
    <>
      {/* AR 识别层 */}
      <SimpleAR
        onDetected={handleDetected}
        onClose={onClose}
      />

      {/* 对话框泡泡 */}
      {showDialogue && isDetected && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md px-4">
          <div className="relative">
            {/* 泡泡主体 */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 relative">
              {/* 小尾巴 */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45"></div>
              
              {/* 内容 */}
              <div className="relative z-10">
                {/* 天坛小图标 */}
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-2xl">
                  🏛️
                </div>
                
                {/* 文字 */}
                <p className="text-gray-800 text-center leading-relaxed animate-typewriter">
                  {currentDialogue?.text}
                </p>
                
                {/* 进度指示器 */}
                <div className="mt-4 flex justify-center gap-2">
                  {dialogues.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentDialogueIndex
                          ? 'bg-red-500 w-6'
                          : index < currentDialogueIndex
                          ? 'bg-red-300'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* 跳过按钮 */}
            <button
              onClick={() => setShowDialogue(false)}
              className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 识别成功提示 */}
      {!showDialogue && isDetected && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[60]">
          <div className="px-6 py-3 bg-green-500 text-white rounded-full shadow-lg">
            ✓ {language === 'zh' ? '识别成功！' : 'Recognition Successful!'}
          </div>
        </div>
      )}
    </>
  );
}
