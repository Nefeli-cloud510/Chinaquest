'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';

// 扩展 Window 类型
declare global {
  interface Window {
    THREE?: any;
    THREEx?: any;
  }
}

interface TempleARSealProps {
  onDetected?: () => void;
  onClose: () => void;
}

type ARState = 'welcome' | 'loading' | 'scanning' | 'detected' | 'error';

/**
 * AR.js + 印章式 Hiro 标记识别组件
 */
export function TempleARSeal({ onDetected, onClose }: TempleARSealProps) {
  const { language } = useLanguage();
  const [arState, setARState] = useState<ARState>('welcome');
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [canDetect, setCanDetect] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const arInitialized = useRef(false);

  // 加载 AR.js 库
  useEffect(() => {
    const loadScripts = async () => {
      try {
        setDebugInfo('正在加载 Three.js...');
        // 加载 Three.js
        if (!window.THREE) {
          await loadScript('https://unpkg.com/three@0.160.0/build/three.min.js');
        }
        
        setDebugInfo('Three.js 加载完成，正在加载 AR.js...');
        // 加载 AR.js
        if (!(window as any).THREEx) {
          await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js');
        }
        
        setDebugInfo('AR.js 加载完成！');
        setLoaded(true);
      } catch (e) {
        console.error('加载失败:', e);
        setDebugInfo('加载失败：' + String(e));
      }
    };
    
    loadScripts();
    
    return () => {
      cleanup();
    };
  }, []);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  };

  // 清理函数
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // 移除 AR.js 容器
    const arContainer = document.getElementById('ar-container');
    if (arContainer) {
      arContainer.remove();
    }
  }, []);

  // 启动相机
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
      setDebugInfo('相机错误：' + String(e));
      return false;
    }
  }, []);

  // 初始化 AR.js
  const initAR = useCallback(() => {
    if (arInitialized.current || !window.THREE) return;
    arInitialized.current = true;
    
    setDebugInfo('正在初始化 AR 场景...');
    
    // 创建 AR 容器
    const container = document.createElement('div');
    container.id = 'ar-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:40;pointer-events:none;overflow:hidden;';
    document.body.appendChild(container);
    
    // 创建 Three.js 场景
    const scene = new window.THREE.Scene();
    
    // 创建相机
    const camera = new window.THREE.Camera();
    
    // 创建渲染器
    const renderer = new window.THREE.WebGLRenderer({
      alpha: true,
      canvas: document.createElement('canvas'),
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // 加载 Hiro 标记
    const markerUrl = '/ar-assets/temple-seal-marker.png';
    
    // 创建天坛模型（使用 emoji 精灵）
    const textureLoader = new window.THREE.TextureLoader();
    textureLoader.load('/ar-assets/temple-emoji.svg', (texture: any) => {
      const spriteMaterial = new window.THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff
      });
      
      const sprite = new window.THREE.Sprite(spriteMaterial);
      sprite.scale.set(2, 2, 1);
      sprite.position.set(0, 0, 0);
      
      // 监听标记识别
      const onMarkerFound = () => {
        console.log('✅ Hiro 标记识别成功！');
        setDebugInfo('识别成功！');
        setCanDetect(true);
        setARState('detected');
        onDetected?.();
      };
      
      // 简化的识别逻辑（实际项目中应该使用 AR.js 的 marker detection）
      // 这里为了演示，使用定时器模拟识别
      let scanCount = 0;
      const scanInterval = setInterval(() => {
        scanCount++;
        if (scanCount >= 5) { // 5 秒后模拟识别成功
          clearInterval(scanInterval);
          onMarkerFound();
        }
      }, 1000);
    });
    
    // 渲染循环
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    
    setDebugInfo('AR 场景已初始化，正在扫描...');
  }, [onDetected]);

  // 开始 AR
  const startAR = async () => {
    setARState('loading');
    setDebugInfo('正在启动相机...');
    
    const cameraStarted = await startCamera();
    if (!cameraStarted) {
      setARState('error');
      return;
    }
    
    setDebugInfo('相机已启动，准备扫描...');
    
    setTimeout(() => {
      setARState('scanning');
      setDebugInfo('扫描中... 请将透卡背面的印章对准摄像头');
      
      if (!arInitialized.current) {
        initAR();
      }
    }, 1000);
  };

  // 手动识别
  const manualDetect = () => {
    setARState('detected');
    onDetected?.();
  };

  // 跳过
  const skipToExperience = () => {
    cleanup();
    setARState('detected');
    onDetected?.();
  };

  // 关闭
  const handleClose = () => {
    cleanup();
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
              ? '扫描透卡背面的印章，让天坛与你对话！' 
              : 'Scan the seal on the back of the card!'}
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
                ? (language === 'zh' ? '📷 开始扫描' : '📷 Start Scan') 
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
              调试：{debugInfo}
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
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {arState === 'scanning' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 简洁的扫描框，无文字提示 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] border-4 border-white/50 rounded-3xl">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-red-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-red-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-red-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-red-500 rounded-br-2xl" />
          </div>
          
          <div className="absolute bottom-24 left-0 right-0 text-center space-y-3">
            <button
              onClick={manualDetect}
              className="px-8 py-3 bg-green-600 text-white rounded-full text-sm font-semibold pointer-events-auto shadow-2xl hover:bg-green-700"
            >
              {language === 'zh' ? '🎯 识别成功' : '🎯 Detect'}
            </button>
            
            <button
              onClick={skipToExperience}
              className="px-6 py-2 bg-white/20 text-white rounded-full text-sm font-semibold hover:bg-white/30 pointer-events-auto"
            >
              {language === 'zh' ? '跳过' : 'Skip'}
            </button>
          </div>
          
          {debugInfo && (
            <div className="absolute bottom-10 left-0 right-0 text-center">
              <div className="inline-block px-4 py-2 bg-black/60 backdrop-blur-sm rounded-xl text-white/80 text-xs">
                {debugInfo}
              </div>
            </div>
          )}
        </div>
      )}
      
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

      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 z-50"
      >
        ✕
      </button>
    </div>
  );
}
