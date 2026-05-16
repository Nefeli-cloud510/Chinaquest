'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/language';
import { Card } from '@/components/ui';

interface ImageTargetARProps {
  targetImageUrl: string;  // 识别目标图片 URL
  onDetected?: () => void; // 识别成功回调
  onClose: () => void;     // 关闭回调
}

type ARState = 'permission' | 'loading' | 'scanning' | 'detected' | 'error';

export function ImageTargetAR({ targetImageUrl, onDetected, onClose }: ImageTargetARProps) {
  const { language } = useLanguage();
  const [arState, setARState] = useState<ARState>('permission');
  const [mindAR, setMindAR] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 加载 MindAR 库
  useEffect(() => {
    const loadMindAR = async () => {
      try {
        // 动态加载 MindAR CDN (使用多个备用源)
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-three.prod.js';
        script.crossOrigin = 'anonymous';
        script.async = true;
        
        script.onload = () => {
          console.log('MindAR loaded successfully');
          if ((window as any).MINDAR) {
            setMindAR((window as any).MINDAR);
            setARState('loading');
          } else {
            console.error('MindAR loaded but MINDAR not found on window');
            setARState('error');
          }
        };
        
        script.onerror = (error) => {
          console.error('Failed to load MindAR:', error);
          setARState('error');
        };
        
        document.body.appendChild(script);
        
        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      } catch (error) {
        console.error('Error loading MindAR:', error);
        setARState('error');
      }
    };
    
    loadMindAR();
  }, []);

  // 初始化 AR
  useEffect(() => {
    if (!mindAR || arState !== 'loading') return;

    const initAR = async () => {
      try {
        // 创建 MindAR + Three.js 环境
        const mindARThree = new mindAR.MINDARThreeApp(
          {
            useVideo: true,
            filterMinCF: 0.001,
            filterBeta: 0.5,
          },
          {
            maxTrack: 1,
            pack: false,
          }
        );

        // 加载目标图片
        const targetResult = await mindARThree.addImageTargets(targetImageUrl);
        console.log('Target loaded:', targetResult);

        if (targetResult && targetResult.length > 0) {
          // 启动 AR
          await mindARThree.start();
          
          // 设置视频流
          if (videoRef.current) {
            videoRef.current.srcObject = mindARThree.renderer.domElement;
          }

          setARState('scanning');

          // 监听识别事件
          mindARThree.on('targetFound', () => {
            console.log('Target found!');
            setARState('detected');
            onDetected?.();
          });

          mindARThree.on('targetLost', () => {
            console.log('Target lost');
            setARState('scanning');
          });

          // 存储 mindARThree 实例以便清理
          (window as any).mindARInstance = mindARThree;
        } else {
          setARState('error');
        }
      } catch (error) {
        console.error('AR initialization error:', error);
        setARState('error');
      }
    };

    initAR();
  }, [mindAR, arState, targetImageUrl, onDetected]);

  // 清理
  useEffect(() => {
    return () => {
      if ((window as any).mindARInstance) {
        (window as any).mindARInstance.stop();
        (window as any).mindARInstance.renderer.dispose();
      }
    };
  }, []);

  // 状态渲染
  if (arState === 'permission') {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📷</div>
          <h3 className="text-lg font-semibold mb-2">
            {language === 'zh' ? '需要相机权限' : 'Camera Permission Required'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {language === 'zh' 
              ? 'AR 体验需要使用相机来识别天坛透卡' 
              : 'AR experience requires camera to recognize the Temple of Heaven card'}
          </p>
          <button
            onClick={() => setARState('loading')}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            {language === 'zh' ? '允许使用相机' : 'Allow Camera Access'}
          </button>
        </div>
      </Card>
    );
  }

  if (arState === 'loading') {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">
            {language === 'zh' ? '正在启动 AR...' : 'Starting AR...'}
          </p>
        </div>
      </Card>
    );
  }

  if (arState === 'error') {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">
            {language === 'zh' ? 'AR 启动失败' : 'AR Failed to Start'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {language === 'zh' 
              ? '请检查相机权限或网络连接' 
              : 'Please check camera permissions or network connection'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setARState('loading')}
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              {language === 'zh' ? '重试' : 'Retry'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              {language === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black">
      {/* 视频画面 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Canvas（MindAR 渲染用） */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'none' }}
      />

      {/* 扫描提示 */}
      {arState === 'scanning' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-0 right-0 text-center">
            <div className="inline-block px-6 py-3 bg-black/60 backdrop-blur-sm rounded-2xl text-white">
              <p className="text-sm">
                {language === 'zh' 
                  ? '请将天坛透卡对准摄像头' 
                  : 'Point the Temple of Heaven card at the camera'}
              </p>
            </div>
          </div>
          
          {/* 扫描框 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/50 rounded-lg">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500"></div>
          </div>
        </div>
      )}

      {/* 识别成功 - 这里会显示 3D 内容和对话框 */}
      {arState === 'detected' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 3D 内容容器 - MindAR 会在这里渲染 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
            {/* 这里会由 MindAR 注入 3D 模型 */}
          </div>
        </div>
      )}

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 pointer-events-auto z-50"
      >
        ✕
      </button>
    </div>
  );
}
