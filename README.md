# WebSpeak Skin: Onyx

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WebSpeak: >= 0.2.8](https://img.shields.io/badge/WebSpeak->=%200.2.8-10a37f.svg)](https://github.com/EchoSixHIYA/WebSpeak-client-for-TeamSpeak)
[![Schema: v3 Open Skin](https://img.shields.io/badge/Schema-v3%20Open%20Skin-black.svg)](https://github.com/EchoSixHIYA/WebSpeak-client-for-TeamSpeak/blob/master/docs/SKIN_DEVELOPMENT.md)

**Onyx** 是一款专为 [WebSpeak](https://github.com/EchoSixHIYA/WebSpeak-client-for-TeamSpeak) (TeamSpeak Web 端语音客户端) 设计的 **OpenAI / ChatGPT** 极简暗黑风格开放皮肤包 (`.wskin`)。

---

## ✨ 核心特性

### 1. 深度纯正的 OpenAI 沉浸暗黑美学 (Onyx Dark Aesthetic)
- **多层级炭黑调色盘**：以 `#171717` 炭黑为画布底色与侧边栏基底，搭配 `#212121` 哑光主舞台、`#2f2f2f` 悬停容器及 `rgba(255, 255, 255, 0.08)` 精致微边框。
- **高对比度白色主操作键**：登录连接按钮、弹窗确认及发送按钮均采用纯白背景 (`#ffffff`) 搭配深黑加粗文字 (`#0d0d0d`)，呈现极简大气的视觉反差。
- **OpenAI 经典翡翠绿活跃态**：说话状态外环 (`outline: 3px solid #10a37f`)、网关连接状态点、在线状态点与当前频道标识线均采用清澈的 `#10a37f` 翡翠绿。
- **ChatGPT 标志性对话流与 Prompt 胶囊**：文字聊天彻底去除臃肿的气球气泡，转为紧凑通透的阅读流；底部输入框重塑为圆角 Prompt 输入舱（14px 圆角微亮边）与纯白圆形发送小按钮。
- **全视口撑满布局**：聊天面板与侧栏 100% 纵向贯穿到底，底部的 ChatGPT 风格 Prompt 输入框稳定吸附在聊天栏最底端，无任何悬空或断层。

### 2. 界面净化与外部推广元素彻底隐藏
- **抑制外部营销图标**：自动且彻底隐藏顶栏的 GitHub 仓库 (`.github-button`)、QQ 交流群 (`.qq-button`)、Bilibili 入口 (`.bilibili-button`)、更新日志跳转 (`.changelog-button`) 与版本号徽标 (`.version-badge`)。
- **保留管理通道**：首页底部的外部推广图标已隐藏，但**精准保留并美化管理后台 (`/admin`) 入口**，方便管理员快速直达控制台。
- **消除游戏化与科幻动效**：移除了首页声呐波纹、音频条动效、访客轨道旋转以及语音活动区大尺寸立绘，界面回归干净、克制、专注的现代生产力工具本质。

### 3. 持久化工作区支持 (Persistent Workspace Mode)
- 遵循 WebSpeak 0.2.8 工作区接口 v1 规范，断开连接或页面刷新后依然完整保留客户端工作区、频道树与服务器导航，体验完全对齐现代 Web 客户端。
- 断开时顶部浮现居中的轻量级重连状态胶囊，右侧“立即重连”按钮平整完整，永不截断或折行。

### 4. 完美兼容用户真实头像与多语言
- 完全放行 TeamSpeak 用户上传的自定义头像图片，确保其在舞台与列表中高清圆角渲染；无头像用户统一采用 `#2f2f2f` 炭灰底色加纯白首字母占位。
- 100% 透传 WebSpeak 官方多语言系统（中文、英文、德文、俄文、日文），无文本断层。

---

## 📦 文件结构

```text
webspeak-skin-onyx/
├── src/
│   ├── manifest.json        # 皮肤元数据清单 (Schema v3 open-skin, v1.3.1)
│   ├── skin.css             # 完整的 OpenAI 样式重构与元素隐藏样式表
│   └── assets/
│       └── preview.png      # 皮肤预览封面图 (640x360 PNG)
├── scripts/
│   ├── build.mjs            # 规范打包脚本 (生成 onyx.wskin 与更新 skin.json)
│   └── generate-assets.mjs  # 纯原生 PNG 封面图生成器
├── test/
│   └── skin.test.mjs        # 自动化测试 (容器、校验器规则、作用域、SHA-256)
├── onyx.wskin               # 编译好的成品交付包 (可直接在 WebSpeak 后台导入)
├── skin.json                # WebSpeak GitHub 皮肤商店中央索引元数据
└── package.json
```

---

## 🚀 安装方式

1. 以管理员身份登录 WebSpeak 后台：`https://<你的域名>/admin/skins`；
2. 切换至 **“实例皮肤” (Instance Skins)** 页面；
3. 点击 **“导入皮肤包”** 按钮，选择本项目根目录下的 **`onyx.wskin`** 文件上传；
4. 导入成功后，在皮肤列表中找到 **Onyx**，点击右侧的 **“设为默认”**（或在客户端前端通过皮肤选择器手动选用）。

---

## 🛠️ 构建与测试

本项目采用极简的零外部依赖架构，打包与自测均通过原生 Node.js 驱动：

```bash
# 安装开发测试依赖 (PostCSS 静态语法分析器)
npm install

# 编译打包 .wskin 并自动计算同步更新 skin.json
npm run build

# 运行 WebSpeak 兼容性规范、CSS 作用域与容器完整性自动化测试
npm test
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
