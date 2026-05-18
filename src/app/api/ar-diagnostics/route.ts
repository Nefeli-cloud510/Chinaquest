import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

interface DiagnosticsPayload {
  trigger?: string;
  page?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  screen?: { width?: number; height?: number; availWidth?: number; availHeight?: number };
  inner?: { width?: number; height?: number };
  viewport?: { width?: number; height?: number; offsetTop?: number; offsetLeft?: number };
  document?: { clientWidth?: number; clientHeight?: number };
  target?: { width?: number; height?: number };
  video?: {
    domWidth?: number;
    domHeight?: number;
    sourceWidth?: number;
    sourceHeight?: number;
    readyState?: number;
  };
  canvas?: {
    domWidth?: number;
    domHeight?: number;
    sceneWidth?: number;
    sceneHeight?: number;
  };
  scale?: { preferred?: number; current?: number };
}

function formatBlock(payload: DiagnosticsPayload) {
  const lines = [
    '==============================',
    `time: ${payload.timestamp || new Date().toISOString()}`,
    `trigger: ${payload.trigger || 'unknown'}`,
    `page: ${payload.page || ''}`,
    `url: ${payload.url || ''}`,
    `userAgent: ${payload.userAgent || ''}`,
    `screen: ${payload.screen?.width || 0}x${payload.screen?.height || 0} avail=${payload.screen?.availWidth || 0}x${payload.screen?.availHeight || 0}`,
    `inner: ${payload.inner?.width || 0}x${payload.inner?.height || 0}`,
    `viewport: ${payload.viewport?.width || 0}x${payload.viewport?.height || 0} offset=${payload.viewport?.offsetLeft || 0},${payload.viewport?.offsetTop || 0}`,
    `document: ${payload.document?.clientWidth || 0}x${payload.document?.clientHeight || 0}`,
    `target: ${payload.target?.width || 0}x${payload.target?.height || 0}`,
    `video-dom: ${payload.video?.domWidth || 0}x${payload.video?.domHeight || 0}`,
    `video-source: ${payload.video?.sourceWidth || 0}x${payload.video?.sourceHeight || 0} readyState=${payload.video?.readyState || 0}`,
    `canvas-dom: ${payload.canvas?.domWidth || 0}x${payload.canvas?.domHeight || 0}`,
    `scene-canvas: ${payload.canvas?.sceneWidth || 0}x${payload.canvas?.sceneHeight || 0}`,
    `scale: preferred=${payload.scale?.preferred || 0} current=${payload.scale?.current || 0}`,
    '',
  ];

  return lines.join('\n');
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as DiagnosticsPayload;
  const targetDir = 'D:\\chinaquest_material';
  const fallbackDir = process.cwd();
  const targetFile = path.join(targetDir, 'ar-diagnostics-log.txt');
  const fallbackFile = path.join(fallbackDir, 'ar-diagnostics-log.txt');

  try {
    await mkdir(targetDir, { recursive: true });
    await appendFile(targetFile, formatBlock(payload), 'utf8');

    return NextResponse.json({ success: true, file: targetFile });
  } catch (error) {
    try {
      await appendFile(fallbackFile, formatBlock(payload), 'utf8');
      return NextResponse.json({ success: true, file: fallbackFile, fallback: true });
    } catch (fallbackError) {
      console.error('AR diagnostics write error:', error);
      console.error('AR diagnostics fallback write error:', fallbackError);
      return NextResponse.json({ success: false, skipped: true });
    }
  }
}
