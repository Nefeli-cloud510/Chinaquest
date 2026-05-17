'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';

// 扩展 Window 类型
declare global {
  interface Window {
    THREE?: any;
    THREEx?: any;
    ARjs?: any;
  }
}

interface TempleARRealProps {
  onDetected?: () => void;
  onClose: () => void;
}

type ARState = 'welcome' | 'loading' | 'scanning' | 'detected' | 'error';

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

/**
 * 真正的 AR.js + Hiro 标记识别组件（带对话框跟随）
 */
export function TempleARReal({ onDetected, onClose }: TempleARRealProps) {
  const { language } = useLanguage();
  const [arState, setARState] = useState<ARState>('welcome');
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [debugInfo, setDebugInfo] = useState('');
  const arInitialized = useRef(false);
  
  // AR 相关引用
  const markerRootRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // 对话框状态
  const [showDialogue, setShowDialogue] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [dialogPosition, setDialogPosition] = useState({ x: 50, y: 60 });

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
        if (!window.ARjs) {
          await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex.js');
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
    
    // 停止动画循环
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
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
    
    // 创建 Hiro 标记根节点
    markerRootRef.current = new window.THREE.Group();
    scene.add(markerRootRef.current);
    
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
      
      markerRootRef.current.add(sprite);
    });
    
    // 使用 AR.js 的 ArtoolkitMarkerDetector
    const arContext = new window.THREE.ArtoolkitContext({
      cameraParamUrl: 'https://raw.githack.com/AR-js-org/AR.js/master/data/data/camera_para.dat',
      detectionMode: 'mono',
      maxDetectionRate: 1,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight
    });
    
    // 加载 Hiro 标记
    const markerPatternUrl = '/ar-assets/temple-seal-marker.png';
    
    arContext.addMarker(markerPatternUrl, {
      type: 'template',
      patternUrl: markerPatternUrl,
      onMarkerFound: (event: any) => {
        console.log('✅ Hiro 标记识别成功！');
        setDebugInfo('识别成功！');
        setARState('detected');
        
        // 显示对话框
        setShowDialogue(true);
        onDetected?.();
        
        // 开始播放对话框
        playDialogues();
      },
      onMarkerLost: () => {
        console.log('❌ Hiro 标记丢失');
        setDebugInfo('标记丢失，请重新对准');
      }
    });
    
    // 初始化 AR 上下文
    arContext.init(() => {
      console.log('AR context initialized');
      setDebugInfo('AR 场景已初始化，正在扫描 Hiro 标记...');
      
      // 检测循环
      const detectMarker = () => {
        arContext.update();
        
        // 如果标记被检测到，更新对话框位置
        if (markerRootRef.current && markerRootRef.current.visible) {
          // 获取标记在 3D 空间中的位置
          const markerPosition = new window.THREE.Vector3();
          markerRootRef.current.getWorldPosition(markerPosition);
          
          // 将 3D 坐标转换为 2D 屏幕坐标
          const vector = markerPosition.clone();
          vector.project(camera);
          
          const x = (vector.x * 0.5 + 0.5) * 100;
          const y = (-vector.y * 0.5 + 0.5) * 100;
          
          setDialogPosition({
            x: Math.max(10, Math.min(90, x)),
            y: Math.max(10, Math.min(80, y - 15))
          });
        }
        
        animationFrameRef.current = requestAnimationFrame(detectMarker);
      };
      
      detectMarker();
    });
    
    // 渲染循环
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, [onDetected]);

  // 播放对话框
  const playDialogues = () => {
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

  // 关闭
  const handleClose = () => {
    cleanup();
    onClose();
  };

  const dialogues = templeDialogues[language];
  const currentDialogue = dialogues[currentDialogueIndex];

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
              onClick={handleClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300"
            >
              {language === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
          
          {debugInfo && (
            <div className="mt-4 text-xs text-gray-400">
              调试：{debugInfo}
            </div>
          )}
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
            onClick={handleClose}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700"
          >
            {language === 'zh' ? '关闭' : 'Close'}
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
          {/* 简洁的扫描框 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] border-4 border-white/50 rounded-3xl">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-red-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-red-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-red-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-red-500 rounded-br-2xl" />
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
          {/* 对话框泡泡 - 跟随标记位置 */}
          {showDialogue && (
            <div 
              className="fixed transition-all duration-300 ease-out"
              style={{
                left: `${dialogPosition.x}%`,
                top: `${dialogPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative max-w-md">
                {/* 泡泡主体 */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 relative">
                  {/* 小尾巴 */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45"></div>
                  
                  {/* 内容 */}
                  <div className="relative z-10">
                    {/* 天坛小图标 */}
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-2xl">
                      🏛️
                    </div>
                    
                    {/* 文字 */}
                    <p className="text-gray-800 text-center leading-relaxed">
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
                  className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 text-xs pointer-events-auto"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {/* 识别成功提示 */}
          {!showDialogue && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-7xl animate-bounce">🏛️</div>
              <div className="text-white text-center mt-4 text-2xl font-bold drop-shadow-xl">
                {language === 'zh' ? '识别成功！' : 'Success!'}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 z-50 pointer-events-auto"
      >
        ✕
      </button>
    </div>
  );
}
