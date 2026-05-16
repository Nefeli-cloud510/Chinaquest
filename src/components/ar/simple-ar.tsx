'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';

interface SimpleARProps {
  onDetected?: () => void;
  onClose: () => void;
}

type ARState = 'welcome' | 'loading' | 'scanning' | 'detected' | 'error';

/**
 * 混合方案：原生相机 + MindAR 识别
 */
export function SimpleAR({ onDetected, onClose }: SimpleARProps) {
  const { language } = useLanguage();
  const [arState, setARState] = useState<ARState>('welcome');
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [canDetect, setCanDetect] = useState(false);
  const [matchPercent, setMatchPercent] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);

  // 加载 MindAR 库
  useEffect(() => {
    const loadScripts = async () => {
      try {
        if (!window.AFRAME) {
          await loadSingleScript('https://unpkg.com/aframe@1.4.2/dist/aframe.min.js');
        }
        if (!(window as any).MINDAR) {
          await loadSingleScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js');
        }
        setLoaded(true);
      } catch (e) {
        console.error('加载失败:', e);
      }
    };
    loadScripts();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const loadSingleScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  };

  const startAR = async () => {
    try {
      setARState('loading');
      
      // 启动原生相机
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      
      // 等待视频元素准备好
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
      
      // 启动 MindAR
      initMindARScene();
      
      // 延迟切换到扫描状态，确保相机已显示
      setTimeout(() => {
        setARState('scanning');
      }, 800);
      
    } catch (e) {
      console.error('Camera error:', e);
      setARState('error');
    }
  };

  // 所有编译后的目标文件
  const targetFiles = [
    '/ar-targets/targets.mind',
    '/ar-targets/targets (1).mind',
    '/ar-targets/targets (2).mind',
    '/ar-targets/targets (3).mind',
    '/ar-targets/targets (4).mind',
    '/ar-targets/targets (5).mind',
    '/ar-targets/targets (6).mind',
    '/ar-targets/targets (7).mind',
    '/ar-targets/targets (8).mind',
    '/ar-targets/targets (9).mind',
    '/ar-targets/targets (10).mind',
    '/ar-targets/targets (11).mind',
    '/ar-targets/targets (12).mind',
  ];

  const initMindARScene = () => {
    if (!sceneRef.current) return;
    
    // 创建多个场景，每个对应一个 scale
    let scenesHtml = '';
    targetFiles.forEach((file, index) => {
      scenesHtml += `
        <a-scene
          mindar-image="
            imageTargetSrc: ${file};
            maxTrack: 1;
            filterMinCF: 0.001;
            filterBeta: 1e-30;
            uiScanning: no;
          "
          vr-mode-ui="enabled: false"
          renderer="colorManagement: true, physicallyCorrectLights: true;"
          id="ar-scene-${index}"
          style="display: none;"
        >
          <a-entity
            mindar-image-target="targetIndex: 0"
            id="target-${index}"
          >
            <a-plane
              color="#dc2626"
              position="0 0 0"
              height="1.5"
              width="1.5"
              rotation="-90 0 0"
              material="opacity: 0.7"
            ></a-plane>
            <a-text
              value="${language === 'zh' ? '你好，天坛！' : 'Hello, Temple!'}"
              position="0 0.8 0"
              rotation="-90 0 0"
              color="#ffffff"
              font="mozillavr"
              font-size="60"
              width="4"
              align="center"
            ></a-text>
          </a-entity>
          
          <a-camera active="true"></a-camera>
        </a-scene>
      `;
    });
    
    sceneRef.current.innerHTML = scenesHtml;
    
    // 监听所有场景的识别事件
    setTimeout(() => {
      targetFiles.forEach((_, index) => {
        const sceneEl = document.querySelector(`#ar-scene-${index}`);
        if (sceneEl) {
          sceneEl.addEventListener('targetFound', () => {
            console.log(`✅ MindAR 识别成功！ (scale ${index})`);
            setCanDetect(true);
            setMatchPercent(80);
            setARState('detected');
            onDetected?.();
          });
          
          sceneEl.addEventListener('targetLost', () => {
            console.log(`❌ 目标丢失 (scale ${index})`);
            setCanDetect(false);
            setMatchPercent(0);
            setARState('scanning');
          });
        }
      });
    }, 2000);
  };

  const tryDetect = () => {
    if (canDetect) {
      setARState('detected');
      onDetected?.();
    }
  };

  const skipToExperience = () => {
    setARState('detected');
    onDetected?.();
  };

  // 欢迎页
  if (arState === 'welcome') {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🏛️</div>
          <h3 className="text-xl font-semibold mb-2">
            {language === 'zh' ? '天坛 AR 体验' : 'Temple of Heaven AR'}
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            {language === 'zh' 
              ? '扫描透卡，让天坛与你对话！' 
              : 'Scan card, let the Temple talk to you!'}
          </p>
          
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={startAR}
              disabled={!loaded}
              className={`px-6 py-3 rounded-full font-semibold ${
                loaded 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {loaded 
                ? (language === 'zh' ? '📷 启动识别' : '📷 Start Recognition') 
                : (language === 'zh' ? '⏳ 加载中...' : '⏳ Loading...')}
            </button>
            
            <button
              onClick={skipToExperience}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300"
            >
              {language === 'zh' ? '⏭️ 跳过' : '⏭️ Skip'}
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 text-sm text-gray-500 hover:text-gray-700"
          >
            {language === 'zh' ? '关闭' : 'Close'}
          </button>
        </div>
      </Card>
    );
  }

  // 加载中
  if (arState === 'loading') {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* 视频元素在加载时就显示 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-white text-sm">
              {language === 'zh' ? '正在启动相机...' : 'Starting camera...'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white"
        >
          ✕
        </button>
      </div>
    );
  }

  // 错误
  if (arState === 'error') {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">
            {language === 'zh' ? '相机启动失败' : 'Camera failed'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {language === 'zh' 
              ? '请检查相机权限设置' 
              : 'Please check camera permissions'}
          </p>
          <button
            onClick={skipToExperience}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700"
          >
            {language === 'zh' ? '直接体验' : 'Experience'}
          </button>
        </div>
      </Card>
    );
  }

  // 扫描或检测到
  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* 原生相机视频 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* MindAR 隐藏场景 */}
      <div ref={sceneRef} className="hidden" />
      
      {/* UI 覆盖层 */}
      {arState === 'scanning' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 顶部提示 + 匹配度 */}
          <div className="absolute top-16 left-0 right-0 text-center space-y-2">
            <div className="inline-block px-6 py-3 bg-black/70 backdrop-blur-sm rounded-2xl text-white">
              <p className="text-sm font-medium">
                {language === 'zh' ? '把透卡完全放进框里' : 'Put card fully inside box'}
              </p>
            </div>
            
            <div className="inline-block px-4 py-2 bg-black/60 backdrop-blur-sm rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs">
                  {language === 'zh' ? '匹配度' : 'Match'}:
                </span>
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${matchPercent > 20 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min(matchPercent * 2, 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${matchPercent > 20 ? 'text-green-400' : 'text-white'}`}>
                  {matchPercent}%
                </span>
              </div>
            </div>
          </div>
          
          {/* 扫描框 - 更大，几乎全屏 */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[70vh] border-4 rounded-3xl transition-colors duration-300 ${canDetect ? 'border-green-500' : 'border-white/50'}`}>
            {!canDetect && <div className="absolute inset-0 border-4 border-red-500 animate-ping rounded-3xl opacity-10" />}
            <div className={`absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 rounded-tl-2xl ${canDetect ? 'border-green-500' : 'border-red-500'}`} />
            <div className={`absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 rounded-tr-2xl ${canDetect ? 'border-green-500' : 'border-red-500'}`} />
            <div className={`absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 rounded-bl-2xl ${canDetect ? 'border-green-500' : 'border-red-500'}`} />
            <div className={`absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 rounded-br-2xl ${canDetect ? 'border-green-500' : 'border-red-500'}`} />
            
            {/* 中心提示 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/30 text-center">
              <div className="text-4xl mb-2">📱</div>
              <div className="text-xs">
                {language === 'zh' ? '整个画面都在识别范围内' : 'Whole screen is scanning'}
              </div>
            </div>
          </div>
          
          {/* 识别按钮 */}
          <div className="absolute bottom-24 left-0 right-0 text-center space-y-3">
            <button
              onClick={tryDetect}
              disabled={!canDetect}
              className={`px-8 py-3 rounded-full text-sm font-semibold pointer-events-auto shadow-2xl transition-all ${
                canDetect
                  ? 'bg-green-600 text-white hover:bg-green-700 scale-105' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              {canDetect 
                ? (language === 'zh' ? '🎯 识别成功！' : '🎯 Detect!') 
                : (language === 'zh' ? '等待匹配...' : 'Waiting for match...')}
            </button>
            
            <div className="block">
              <button
                onClick={skipToExperience}
                className="px-6 py-2 bg-white/20 text-white rounded-full text-sm font-semibold hover:bg-white/30 pointer-events-auto"
              >
                {language === 'zh' ? '跳过' : 'Skip'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 检测成功动画 */}
      {arState === 'detected' && (
        <div className="absolute inset-0 pointer-events-none bg-black/30">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-7xl animate-bounce">🏛️</div>
            <div className="text-white text-center mt-4 text-2xl font-bold drop-shadow-xl">
              {language === 'zh' ? '识别成功！' : 'Success!'}
            </div>
          </div>
        </div>
      )}

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 z-50"
      >
        ✕
      </button>
    </div>
  );
}
