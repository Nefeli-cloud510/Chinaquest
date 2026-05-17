'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { withBasePath } from '@/lib/base-path';
import { SiteShell } from '@/components/shell';
import { Card } from '@/components/ui';
import { TempleARSimple } from '@/components/ar';

const pageLabels = {
  title: { zh: '天坛 AR 扫描体验', en: 'Temple of Heaven AR Experience' },
  description: {
    zh: '扫描天坛专属识别图，即可在网页中唤起摄像头并呈现天坛 3D 模型。这一版已经接入网站正式入口，后续将在此基础上继续优化交互与内容。',
    en: 'Scan the Temple marker to open the camera and render the Temple 3D model. This version is now integrated into the main site flow.',
  },
  startAR: { zh: '打开天坛 AR', en: 'Open Temple AR' },
  readyTitle: { zh: '使用准备', en: 'Before You Start' },
  readyMarker: {
    zh: '打印或展示天坛专属 marker，尽量保持图案完整、平整、光线均匀。',
    en: 'Prepare the custom Temple marker with a flat surface and even lighting.',
  },
  readyCamera: {
    zh: '建议使用手机后置摄像头，首次进入时允许浏览器访问相机。',
    en: 'Use a rear camera when possible and allow browser camera access.',
  },
  readyDistance: {
    zh: '扫描时先把 marker 放在取景框中央，再缓慢前后移动寻找最佳识别距离。',
    en: 'Center the marker first, then move slowly to find the best recognition distance.',
  },
  markerTitle: { zh: '当前识别图', en: 'Current Marker' },
  markerHint: {
    zh: '当前网站正式入口使用这张自定义天坛 marker 进行识别。',
    en: 'The main site entry now uses this custom Temple marker for recognition.',
  },
  markerDownload: { zh: '打开识别图', en: 'Open Marker' },
  productTitle: { zh: '本阶段已完成', en: 'What Is Ready' },
  productItem1: {
    zh: '网站正式入口已接入自定义 marker 识别链路',
    en: 'The official site entry now uses the custom marker pipeline',
  },
  productItem2: {
    zh: '识别成功后可显示红色参照方块与天坛 3D 模型',
    en: 'The red anchor box and Temple 3D model render after recognition',
  },
  productItem3: {
    zh: '后续可以继续在这一入口上迭代 UI、模型姿态和产品逻辑',
    en: 'This entry is ready for future UI, model, and product iterations',
  },
  success: {
    zh: '本设备已完成一次成功识别，可以继续进入正式产品迭代。',
    en: 'This device has completed a successful recognition and is ready for product iteration.',
  },
};

export default function TempleOfHeavenPage() {
  const { language } = useLanguage();
  const [showAR, setShowAR] = useState(false);
  const [hasDetected, setHasDetected] = useState(false);
  const markerImageSrc = withBasePath('/ar/patterns/pattern-temple_of_heaven_hiro.png');

  if (showAR) {
    return (
      <TempleARSimple
        onClose={() => setShowAR(false)}
        onDetected={() => setHasDetected(true)}
      />
    );
  }

  return (
    <SiteShell active="routes">
      <div className="grid gap-6">
        <Card>
          <div className="grid gap-8 p-2 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div className="py-6">
              <div className="mb-4 inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                ChinaQuest AR
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
                {pageLabels.title[language]}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                {pageLabels.description[language]}
              </p>

              {hasDetected ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {pageLabels.success[language]}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowAR(true)}
                  className="rounded-full bg-gradient-to-r from-red-600 to-yellow-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:from-red-700 hover:to-yellow-700"
                >
                  {pageLabels.startAR[language]}
                </button>
                <a
                  href={markerImageSrc}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  {pageLabels.markerDownload[language]}
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">{pageLabels.markerTitle[language]}</div>
              <p className="mt-2 text-sm leading-6 text-gray-600">{pageLabels.markerHint[language]}</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3">
                <img
                  src={markerImageSrc}
                  alt="Temple marker preview"
                  className="mx-auto block w-full max-w-[320px] rounded-xl object-contain"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="p-2">
              <h2 className="text-xl font-semibold text-gray-900">{pageLabels.readyTitle[language]}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                <li>{pageLabels.readyMarker[language]}</li>
                <li>{pageLabels.readyCamera[language]}</li>
                <li>{pageLabels.readyDistance[language]}</li>
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-2">
              <h2 className="text-xl font-semibold text-gray-900">{pageLabels.productTitle[language]}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                <li>{pageLabels.productItem1[language]}</li>
                <li>{pageLabels.productItem2[language]}</li>
                <li>{pageLabels.productItem3[language]}</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
