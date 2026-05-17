'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';

// 扩展 Window 类型
declare global {
  interface Window {
    AFRAME?: any;
    MINDAR?: any;
  }
}

interface SimpleARProps {
  onDetected?: () => void;
  onClose: () => void;
}

type ARState = 'welcome' | 'loading' | 'scanning' | 'detected' | 'error';

/**
 * 可靠的 MindAR 图像识别组件
 * 
 * 业务逻辑：
 * 1. 加载 A-Frame 和 MindAR 库
 * 2. 启动原生相机显示视频
 * 3. 创建 MindAR 场景（使用 A-Frame 的相机）
 * 4. MindAR 自动处理图像识别
 * 5. 识别成功后触发回调
 */
export function SimpleAR({ onDetected, onClose }: SimpleARProps) {
  const { language } = useLanguage();
  const [arState, setARState] = useState<ARState>('welcome');
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [canDetect, setCanDetect] = useState(false);
  const [matchPercent, setMatchPercent] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');
  const mindarInitialized = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 加载 MindAR 库
  useEffect(() => {
    const loadScripts = async () => {
      try {
        setDebugInfo('正在加载 A-Frame...');
        if (!window.AFRAME) {
          await loadSingleScript('https://unpkg.com/aframe@1.4.2/dist/aframe.min.js');
        }
        setDebugInfo('A-Frame 加载完成，正在加载 MindAR...');
        if (!window.MINDAR) {
          await loadSingleScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js');
        }
        setDebugInfo('MindAR 加载完成！');
        setLoaded(true);
      } catch (e) {
        console.error('加载失败:', e);
        setDebugInfo('加载失败: ' + String(e));
      }
    };
    loadScripts();
    
    return () => {
      // 清理：停止相机流
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // 清理：移除 MindAR 容器
      if (containerRef.current) {
        containerRef.current.remove();
      }
    };
  }, []);

  const loadSingleScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  };

  // 启动原生相机（仅用于显示，不用于识别）
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // 等待视频数据加载
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadeddata = () => resolve();
          }
        });
        await videoRef.current.play();
      }
      return true;
    } catch (e) {
      console.error('Camera error:', e);
      setDebugInfo('相机错误: ' + String(e));
      return false;
    }
  }, []);

  // 启动 AR
  const startAR = async () => {
    setARState('loading');
    setDebugInfo('正在启动相机...');
    
    // 步骤 1：启动原生相机（用于显示）
    const cameraStarted = await startCamera();
    if (!cameraStarted) {
      setARState('error');
      return;
    }
    
    setDebugInfo('相机已启动，准备扫描...');
    
    // 步骤 2：切换到扫描状态（显示 UI）
    setTimeout(() => {
      setARState('scanning');
      setDebugInfo('扫描中... 请对准透卡');
      
      // 步骤 3：初始化 MindAR（在扫描状态后）
      if (!mindarInitialized.current) {
        initMindAR();
      }
    }, 1000);
  };

  // 初始化 MindAR
  const initMindAR = () => {
    if (mindarInitialized.current) return;
    mindarInitialized.current = true;
    
    setDebugInfo('正在初始化 MindAR...');
    
    // 创建 MindAR 场景容器
    // 注意：MindAR 会自己启动相机，所以我们不需要传递视频流
    const container = document.createElement('div');
    container.id = 'mindar-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:40;pointer-events:none;opacity:0;';
    document.body.appendChild(container);
    containerRef.current = container;
    
    // 创建 MindAR 场景
    // 使用 embedded 模式，让 MindAR 自己管理相机
    const scene = document.createElement('a-scene');
    scene.setAttribute('mindar-image', `
      imageTargetSrc: /ar-targets/targets.mind;
      maxTrack: 1;
      filterMinCF: 0.001;
      filterBeta: 1e-30;
      uiScanning: no;
    `);
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('renderer', 'colorManagement: true, physicallyCorrectLights: true');
    scene.setAttribute('embedded', '');
    scene.style.cssText = 'width:100%;height:100%;';
    
    // 创建目标实体
    const targetEntity = document.createElement('a-entity');
    targetEntity.setAttribute('mindar-image-target', 'targetIndex: 0');
    
    // 添加可视化元素（识别成功后显示）
    const plane = document.createElement('a-plane');
    plane.setAttribute('color', '#dc2626');
    plane.setAttribute('position', '0 0 0');
    plane.setAttribute('height', '1.5');
    plane.setAttribute('width', '1.5');
    plane.setAttribute('rotation', '-90 0 0');
    plane.setAttribute('material', 'opacity: 0.7');
    
    const text = document.createElement('a-text');
    text.setAttribute('value', language === 'zh' ? '你好，天坛！' : 'Hello, Temple!');
    text.setAttribute('position', '0 0.8 0');
    text.setAttribute('rotation', '-90 0 0');
    text.setAttribute('color', '#ffffff');
    text.setAttribute('align', 'center');
    
    targetEntity.appendChild(plane);
    targetEntity.appendChild(text);
    
    // 添加相机
    const camera = document.createElement('a-camera');
    camera.setAttribute('active', 'true');
    camera.setAttribute('position', '0 0 0');
    
    scene.appendChild(targetEntity);
    scene.appendChild(camera);
    container.appendChild(scene);
    
    // 监听识别事件
    scene.addEventListener('loaded', () => {
      setDebugInfo('MindAR 场景加载完成，正在监听...');
    });
    
    // 识别成功
    scene.addEventListener('targetFound', () => {
      console.log('✅ MindAR 识别成功！');
      setDebugInfo('识别成功！');
      setCanDetect(true);
      setMatchPercent(80);
      setARState('detected');
      onDetected?.();
    });
    
    // 目标丢失
    scene.addEventListener('targetLost', () => {
      console.log('❌ 目标丢失');
      setDebugInfo('目标丢失');
      setCanDetect(false);
      setMatchPercent(0);
    });
  };

  // 手动触发识别（用于测试）
  const tryDetect = () => {
    if (canDetect) {
      setARState('detected');
      onDetected?.();
    }
  };

  // 跳过识别
  const skipToExperience = () => {
    setARState('detected');
    onDetected?.();
  };

  // 关闭
  const handleClose = () => {
    // 停止相机流
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // 移除 MindAR 容器
    if (containerRef.current) {
      containerRef.current.remove();
    }
    onClose();
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
          
          {debugInfo && (
            <div className="mt-4 text-xs text-gray-400">
              调试: {debugInfo}
            </div>
          )}
          
          <button
            onClick={handleClose}
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
            {debugInfo && (
              <p className="text-white/60 text-xs mt-2">{debugInfo}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleClose}
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
          {debugInfo && (
            <p className="text-xs text-gray-400 mb-4">{debugInfo}</p>
          )}
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
      {/* 原生相机视频（仅用于显示） */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* UI 覆盖层 */}
      {arState === 'scanning' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 顶部提示 + 匹配度 + 调试信息 */}
          <div className="absolute top-16 left-0 right-0 text-center space-y-2">
            <div className="inline-block px-6 py-3 bg-black/70 backdrop-blur-sm rounded-2xl text-white">
              <p className="text-sm font-medium">
                {language === 'zh' ? '把透卡对准摄像头' : 'Point card to camera'}
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
            
            {debugInfo && (
              <div className="inline-block px-3 py-1 bg-black/40 rounded text-white/60 text-xs">
                {debugInfo}
              </div>
            )}
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
        onClick={handleClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 z-50"
      >
        ✕
      </button>
    </div>
  );
}
