// 图片路径辅助函数
// 处理 GitHub Pages 部署时的 basePath 问题

import { withBasePath } from './base-path';

export function getImagePath(path: string): string {
  return withBasePath(path.startsWith('/') ? path : `/${path}`);
}
