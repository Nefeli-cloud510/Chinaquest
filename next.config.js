/**
 * Next.js 配置文件
 * 作用：适配 GitHub Pages 部署，输出纯静态文件
 * 关键配置说明：
 * 1. output: 'export' → 强制Next.js构建为纯静态HTML/CSS/JS（无服务端依赖）
 * 2. basePath: '/Chinaquest' → 匹配GitHub仓库名，避免资源路径404
 * 3. trailingSlash: true → 强制生成带/的页面路径，解决GitHub Pages路由问题
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 核心：输出纯静态文件（必选）
  output: 'export',
  // 匹配GitHub仓库名（仓库名是Chinaquest，所以填/Chinaquest，区分大小写）
  basePath: '/Chinaquest',
  // 强制页面路径带/，避免404（比如 /about → /about/）
  trailingSlash: true,
  // 可选：关闭严格模式（开发/部署更稳定）
  reactStrictMode: false,
  // 可选：禁用图片优化（GitHub Pages无服务端，图片优化会报错）
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig