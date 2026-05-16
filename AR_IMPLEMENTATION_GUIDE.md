# 天坛 AR 体验 - 实施指南

## 📋 已完成的工作

### 1. 创建的核心组件
- ✅ `ImageTargetAR` - 基础图像识别组件（使用 MindAR）
- ✅ `TempleOfHeavenAR` - 天坛 AR 体验组件（含对话框）
- ✅ 天坛 AR 页面 - `/temple-ar`

### 2. 技术栈
- **MindAR** - WebAR 图像识别库（通过 CDN 加载）
- **Three.js** - 3D 渲染（项目已有）
- **React + Next.js** - 前端框架

---

## 🎯 下一步操作指南

### 第 1 步：安装 npm 依赖（可选）

虽然组件使用 CDN 加载 MindAR，但如果你想在本地安装：

```bash
cd d:\chinaquest_cloud
npm install mind-ar
```

**注意**：当前实现使用 CDN，所以这一步是可选的。

---

### 第 2 步：准备识别目标图片

#### 2.1 拍摄透卡照片

1. **准备透卡**：把你印有天坛的 PV 透卡放在纯色背景上（白色最好）
2. **光线**：确保光线充足，避免阴影
3. **角度**：手机/相机正对透卡拍摄（90 度垂直）
4. **对焦**：确保天坛图案清晰
5. **距离**：不要太近，让天坛图案占画面的 60-80%

#### 2.2 处理图片

使用任何图片处理工具（Photoshop、美图秀秀、画图工具）：

1. **裁剪**：只保留天坛图案部分（去掉多余背景）
2. **增加对比度**：让线条更清晰（对比度 +30%）
3. **调整亮度**：确保图案明亮（亮度 +10%）
4. **可选 - 转黑白**：提高识别率（但会损失美感）
5. **保存**：PNG 格式，文件名 `temple_of_heaven_target.png`

#### 2.3 放置图片

把处理好的图片放到项目目录：

```
d:\chinaquest_cloud\public\ar-targets\temple_of_heaven_target.png
```

**注意**：如果 `ar-targets` 文件夹不存在，请创建它。

---

### 第 3 步：测试运行

#### 3.1 启动开发服务器

```bash
cd d:\chinaquest_cloud
npm run dev
```

#### 3.2 访问测试页面

在浏览器打开：
```
http://localhost:3000/temple-ar
```

#### 3.3 测试流程

1. 点击"开始 AR 体验"按钮
2. 浏览器会请求相机权限 → 点击"允许"
3. 看到摄像头画面和扫描框
4. 把你的天坛透卡对准摄像头
5. 识别成功后，会弹出对话框泡泡

---

## ⚠️ 常见问题排查

### 问题 1：相机无法启动

**原因**：
- 浏览器权限被拒绝
- 使用的是 HTTP 而不是 HTTPS（生产环境必须 HTTPS）

**解决方案**：
- 检查浏览器地址栏右侧的权限设置
- 开发环境 localhost 可以用 HTTP，但部署后必须用 HTTPS

---

### 问题 2：一直无法识别

**可能原因**：
1. 光线太暗
2. 透卡角度不对
3. 目标图片质量不好
4. 摄像头模糊

**解决方案**：
- 在明亮的环境下测试
- 保持摄像头和透卡平行
- 重新拍摄目标图片（更清晰、对比度更高）
- 擦拭摄像头镜头

---

### 问题 3：识别后没有显示对话框

**可能原因**：
- 组件状态没有正确更新

**解决方案**：
- 打开浏览器控制台（F12）查看错误信息
- 检查 `temple-of-heaven-ar.tsx` 中的 `handleDetected` 函数

---

## 🎨 自定义配置

### 修改对话框内容

编辑 `src/components/ar/temple-of-heaven-ar.tsx`：

```typescript
const templeDialogues = {
  zh: [
    {
      text: '你的自定义文本',
      duration: 5000, // 显示时长（毫秒）
    },
    // 添加更多对话
  ],
  en: [
    // 英文版本
  ]
};
```

### 修改对话框样式

在同一个文件中，找到对话框的 JSX 部分，修改：
- 背景颜色：`bg-white` → `bg-red-50`
- 圆角：`rounded-3xl` → `rounded-2xl`
- 大小：`max-w-md` → `max-w-lg`

### 添加 3D 模型

在 `ImageTargetAR` 组件中添加 Three.js 代码：

```typescript
// 在 detected 状态下加载 3D 模型
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('/models/temple.glb', (gltf) => {
  const model = gltf.scene;
  // 将模型添加到场景中
});
```

---

## 📱 部署到生产环境

### 1. 构建项目

```bash
npm run build
```

### 2. 部署到 GitHub Pages

你的项目已经配置了 GitHub Actions，推送到 main 分支会自动部署。

### 3. 重要提醒

- **必须使用 HTTPS**：相机 API 在生产环境需要 HTTPS
- **测试识别效果**：部署后用实体透卡测试
- **性能优化**：如果加载慢，可以压缩目标图片

---

## 🚀 后续优化方向

### 1. 添加 3D 天坛模型
- 从 Sketchfab 下载免费的天坛 3D 模型
- 用 Blender 简化多边形数量
- 导出为 GLB 格式
- 在 AR 中加载

### 2. 添加互动游戏
- 用户点击天坛的不同部位（屋顶、柱子、基座）
- 弹出相应的历史知识
- 收集所有知识点解锁徽章

### 3. 添加语音播放
- 录制天坛的自我介绍音频
- 识别成功后自动播放
- 添加中英文切换

### 4. 多透卡支持
- 为每个站点创建独立的 AR 体验
- 前门、鼓楼、鸟巢都可以用同样的方式

---

## 📞 需要帮助？

如果遇到问题：
1. 检查浏览器控制台错误信息
2. 确认目标图片路径正确
3. 确保相机权限已授予
4. 在 GitHub Issues 中提问

---

**祝你 AR 开发顺利！🎉**
