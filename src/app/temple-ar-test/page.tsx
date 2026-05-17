'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { TempleARSeal } from '@/components/ar';
import { Card, Button } from '@/components/ui';

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

export default function TempleARTestPage() {
  const { language } = useLanguage();
  const [showAR, setShowAR] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);

  const handleDetected = () => {
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
  };

  const dialogues = templeDialogues[language];
  const currentDialogue = dialogues[currentDialogueIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      {/* 页面头部 */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {language === 'zh' ? '🏛️ 天坛 AR 体验' : '🏛️ Temple of Heaven AR'}
        </h1>
        <p className="text-center text-gray-600 mt-2">
          {language === 'zh' 
            ? '扫描透卡背面的印章，让天坛与你对话！' 
            : 'Scan the seal on the back of the card!'}
        </p>
      </div>

      {/* 说明卡片 */}
      <div className="max-w-md mx-auto px-4">
        <Card>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">1️⃣</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {language === 'zh' ? '准备透卡' : 'Prepare the card'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'zh' 
                    ? '取出天坛透卡，背面是红色印章图案' 
                    : 'Take out the Temple of Heaven card with red seal on back'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">2️⃣</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {language === 'zh' ? '启动相机' : 'Start camera'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'zh' 
                    ? '点击下方按钮，启动 AR 扫描' 
                    : 'Click the button below to start AR scan'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">3️⃣</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {language === 'zh' ? '对准印章' : 'Point to seal'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'zh' 
                    ? '将透卡背面的印章对准摄像头，保持 3-5 秒' 
                    : 'Point the seal to camera for 3-5 seconds'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">4️⃣</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {language === 'zh' ? '聆听介绍' : 'Listen to intro'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'zh' 
                    ? '识别成功后，天坛将进行自我介绍' 
                    : 'After recognition, the Temple will introduce itself'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => setShowAR(true)}
              className="w-full h-12 text-lg"
            >
              {language === 'zh' ? '📷 开始扫描' : '📷 Start Scan'}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => window.history.back()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {language === 'zh' ? '返回上一页' : 'Go back'}
            </button>
          </div>
        </Card>
      </div>

      {/* AR 组件 */}
      {showAR && (
        <TempleARSeal 
          onDetected={handleDetected}
          onClose={() => {
            setShowAR(false);
            setIsDetected(false);
            setShowDialogue(false);
          }}
        />
      )}

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
    </div>
  );
}
