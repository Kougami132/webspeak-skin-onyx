# WebSpeak Skin: Onyx

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WebSpeak: >= 0.2.8](https://img.shields.io/badge/WebSpeak->=%200.2.8-10a37f.svg)](https://github.com/EchoSixHIYA/WebSpeak-client-for-TeamSpeak)
[![Schema: v3 Open Skin](https://img.shields.io/badge/Schema-v3%20Open%20Skin-black.svg)](https://github.com/EchoSixHIYA/WebSpeak-client-for-TeamSpeak/blob/master/docs/SKIN_DEVELOPMENT.md)

**Onyx** 是一款专为 [WebSpeak](https://github.com/EchoSixHIYA/WebSpeak-client-for-TeamSpeak) (TeamSpeak Web 端客户端) 打造的 **OpenAI / ChatGPT** 极简暗黑风格皮肤包。

---

## ✨ 设计特性

1. **纯正 OpenAI 沉浸暗黑美学 (Onyx Dark Aesthetic)**
   - **炭黑底色与分层**：以 `#171717` 作为沉浸基底，搭配 `#212121` 哑光舞台与侧边栏、`#2f2f2f` 悬停/输入舱及 `rgba(255,255,255,0.08)` 1px 微边框。
   - **高辨识度主操作按钮**：主连接按钮、弹窗确认与发送按钮采用纯白背景 (`#ffffff`) + 深黑文字 (`#0d0d0d`)，呈现极致反差的高级质感。
   - **OpenAI 翡翠绿活跃态**：麦克风说话状态环 (Speaking Ring)、在线状态、网关指示采用 OpenAI 标志性翡翠绿 (`#10a37f`)，去除多余发光噪点。
   - **Prompt 胶囊风输入与控制坞**：聊天输入框与底部音频控制坞重塑为圆角胶囊造型，对齐 ChatGPT 底部输入框体验。

2. **清爽去噪与隐私保护**
   - **彻底隐藏外部推广元素**：自动隐藏顶部 Header 栏的 GitHub 仓库 (`.github-button`)、QQ 交流群 (`.qq-button`)、Bilibili 入口 (`.bilibili-button`)、更新日志跳转 (`.changelog-button`) 与版本号徽标 (`.version-badge`)。
   - **保留核心管理通道**：首页底部的外部推广图标已被隐藏，同时精准保留管理后台 (`/admin`) 入口。
   - **去除花哨动画**：移除了声呐波纹、音频波形条、访客轨道旋转与立绘装饰层，回归克制专业的生产力工具本质。

3. **持久化工作区架构 (Persistent Workspace Mode)**
   - 遵循 WebSpeak 0.2.8 工作区接口 v1 规范，断开重连或日常回访直接保留工作区与服务器导航，体验贴近现代 Web App。

---

## 📦 文件结构

```text
webspeak-skin-onyx/
├── src/
│   ├── manifest.json        # 皮肤元数据清单 (Schema v3 open-skin)
│   ├── skin.css             # 完整的 OpenAI 风格定制与元素隐藏样式表
│   └── assets/
│       └── preview.png      # 皮肤预览封面图 (640x360)
├── scripts/
│   ├── build.mjs            # 规范打包脚本 (生成 onyx.wskin 与更新 skin.json)
│   └── generate-assets.mjs  # 纯原生 PNG 预览生成器
├── test/
│   └── skin.test.mjs        # 结构、校验器规范与 ZIP 完整性自动化测试
├── onyx.wskin               # 可直接在 WebSpeak 后台导入的交付皮肤包
├── skin.json                # WebSpeak GitHub 皮肤商店中央索引元数据
└── package.json
```

---

## 🚀 安装与使用

### 方式一：WebSpeak 管理后台直接导入（推荐）

1. 进入 WebSpeak 管理控制台：`https://<你的域名>/admin/skins`；
2. 切换至 **“实例皮肤” (Instance Skins)** 页面；
3. 点击 **“导入皮肤包”**，选中本项目根目录下的 **`onyx.wskin`**；
4. 导入成功后，即可在皮肤列表中将其设为实例默认皮肤，或在客户端前端直接切换选用。

### 方式二：GitHub 皮肤商店分发

本项目已在根目录生成合规的 `skin.json` 与标准语义化 Release 结构，可直接登记至官方 [Huddle-Up-Forge/webspeak-skins](https://github.com/Huddle-Up-Forge/webspeak-skins) 索引：

```json
{
  "id": "community.onyx",
  "repository": "https://github.com/<your-username>/webspeak-skin-onyx"
}
```

---

## 🛠️ 构建与测试

本项目无需繁重的构建体系，自带完备的规范自测：

```bash
# 构建 .wskin 归档并重新计算 SHA-256
npm run build

# 运行 WebSpeak 兼容性规范、CSS 校验与容器完整性测试
npm test
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
