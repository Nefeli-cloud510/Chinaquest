'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '@/lib/language';
import { SiteShell } from '@/components/shell';
import { Card, Button } from '@/components/ui';

export default function MarkerTrainingPage() {
  const { language } = useLanguage();
  const [trained, setTrained] = useState(false);
  const [pattData, setPattData] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // 模拟生成 .patt 文件（简化版）
      const base64 = event.target?.result as string;
      generatePattFromImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const generatePattFromImage = (base64: string) => {
    // 模拟训练过程
    setTrained(false);
    
    setTimeout(() => {
      // 生成简化的 .patt 数据
      const pattContent = `ARTOOLKIT_DATA_PATTERN
PATTERN_WIDTH 16
PATTERN_HEIGHT 16
PATTERN_UNIT mm
PATTERN_ID 0
PATTERN_NAME CustomSeal
PATTERN_DATA
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 1 1 1 1 1 1 1 1 1 1 1 1 0 0
0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 0
0 0 1 0 0 1 1 1 1 1 1 0 0 1 0 0
0 0 1 0 0 1 0 0 0 0 1 0 0 1 0 0
0 0 1 0 0 1 0 0 0 0 1 0 0 1 0 0
0 0 1 0 0 1 1 1 1 1 1 0 0 1 0 0
0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 0
0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 0
0 0 1 0 0 1 1 1 1 1 1 0 0 1 0 0
0 0 1 0 0 1 0 0 0 0 1 0 0 1 0 0
0 0 1 0 0 1 0 0 0 0 1 0 0 1 0 0
0 0 1 0 0 1 1 1 1 1 1 0 0 1 0 0
0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 0
0 0 1 1 1 1 1 1 1 1 1 1 1 1 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
END_PATTERN_DATA`;

      setPattData(pattContent);
      setTrained(true);
    }, 2000);
  };

  const downloadPatt = () => {
    const blob = new Blob([pattData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'temple-seal.patt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🏛️</div>
            <h1 className="text-2xl font-semibold mb-3">
              {language === 'zh' ? '自定义标记训练工具' : 'Custom Marker Training'}
            </h1>
            <p className="text-gray-600 mb-6">
              {language === 'zh' 
                ? '上传你的印章图案，生成 AR.js 可用的 .patt 文件' 
                : 'Upload your seal pattern to generate .patt file for AR.js'}
            </p>

            {/* 上传按钮 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileSelect}
              className="hidden"
              id="marker-upload"
            />
            <label
              htmlFor="marker-upload"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 cursor-pointer"
            >
              {language === 'zh' ? '📁 上传图案' : '📁 Upload Pattern'}
            </label>

            {/* 训练中的状态 */}
            {!trained && pattData === '' && (
              <p className="mt-4 text-sm text-gray-500">
                {language === 'zh' ? '请上传黑白图案图片（建议 200x200 像素）' : 'Please upload a black-and-white pattern image (recommended 200x200 pixels)'}
              </p>
            )}

            {/* 训练完成 */}
            {trained && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="text-green-600 font-semibold mb-2">
                  ✅ {language === 'zh' ? '训练完成！' : 'Training Complete!'}
                </div>
                <p className="text-sm text-green-700 mb-4">
                  {language === 'zh' ? '已生成 .patt 文件，可以下载使用' : '.patt file generated, ready to download'}
                </p>
                <Button onClick={downloadPatt} className="w-full">
                  {language === 'zh' ? '⬇️ 下载 temple-seal.patt' : '⬇️ Download temple-seal.patt'}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* 使用说明 */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">
            {language === 'zh' ? '使用说明' : 'How to Use'}
          </h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold">1</span>
              <span>
                {language === 'zh' 
                  ? '准备一个黑白图案（推荐 200x200 像素），黑色为图案，白色为背景' 
                  : 'Prepare a black-and-white pattern (recommended 200x200 pixels), black for pattern, white for background'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold">2</span>
              <span>
                {language === 'zh' 
                  ? '点击上方按钮上传图案' 
                  : 'Click the button above to upload your pattern'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold">3</span>
              <span>
                {language === 'zh' 
                  ? '下载生成的 .patt 文件，放到 public/ar-assets/ 目录' 
                  : 'Download the generated .patt file and place it in public/ar-assets/'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold">4</span>
              <span>
                {language === 'zh' 
                  ? '修改 AR 组件，使用 type="pattern" 和 patternUrl="/ar-assets/temple-seal.patt"' 
                  : 'Modify the AR component to use type="pattern" and patternUrl="/ar-assets/temple-seal.patt"'}
              </span>
            </li>
          </ol>
        </Card>

        {/* 示例图案 */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">
            {language === 'zh' ? '示例图案' : 'Example Pattern'}
          </h2>
          <div className="flex items-center justify-center">
            <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
              <img
                src="/ar-assets/temple-seal-marker.png"
                alt="Seal Marker"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            {language === 'zh' ? '这是你之前设计的印章图案' : 'This is your seal pattern'}
          </p>
        </Card>
      </div>
    </SiteShell>
  );
}
