'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/language';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  onError?: (error: string) => void;
}

export function QRScanner({ onScan, onClose, onError }: QRScannerProps) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef<boolean>(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanQRCode = useCallback(() => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Simplified QR detection simulation
    // In production, use a library like jsQR or @zxing/library
    try {
      // Check if jsQR is available
      if (typeof window !== 'undefined' && (window as any).jsQR) {
        const jsQR = (window as any).jsQR;
        const code = jsQR(imageData.data, canvas.width, canvas.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          scanningRef.current = false;
          setScanning(false);
          onScan(code.data);
          return;
        }
      }
    } catch (e) {
      // jsQR not loaded, continue scanning
    }

    if (scanningRef.current) {
      requestAnimationFrame(scanQRCode);
    }
  }, [onScan]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanningRef.current = true;
        setScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error('Camera error:', err);
      const errorMsg = language === 'zh' 
        ? '无法访问相机，请检查权限设置' 
        : 'Cannot access camera, please check permissions';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [scanQRCode, language, onError]);

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
    setScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  const labels = {
    title: { zh: '扫描二维码', en: 'Scan QR Code' },
    hint: { zh: '将二维码对准相机', en: 'Point your camera at the QR code' },
    noQR: { zh: '未检测到二维码', en: 'No QR code detected' },
    permission: { zh: '需要相机权限', en: 'Camera permission required' },
    close: { zh: '关闭', en: 'Close' },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* 视频画面 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full flex-1 object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* 扫描框 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-2 border-white/50 relative">
          {/* 四角标记 */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[color:var(--cq-gold)]" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[color:var(--cq-gold)]" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[color:var(--cq-gold)]" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[color:var(--cq-gold)]" />
          
          {/* 扫描线动画 */}
          {scanning && (
            <div className="absolute inset-x-0 top-0 h-0.5 bg-[color:var(--cq-gold)] animate-[scan_2s_ease-in-out_infinite]" />
          )}
        </div>
      </div>

      {/* 顶部操作栏 */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <h3 className="text-white font-medium">{labels.title[language]}</h3>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/60"
        >
          ✕
        </button>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white/80 text-center text-sm">
          {error || (scanning ? labels.hint[language] : labels.noQR[language])}
        </p>
      </div>

      {/* 扫描线动画样式 */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 2px); }
        }
      `}</style>
    </div>
  );
}
