# 麦麦搭子契合度报告 · McD Duo Wrapped 🍟

> **2026 麦当劳程序员创意开发大赛参赛作品**  
> 首个基于麦当劳中国官方 MCP（Model Context Protocol）的 **双人/多人合体年度回忆 & 口味默契度报告**。

<p align="center">
  <img src="https://img.mcd.cn/gallery/3fa1addc20b6d2d8.jpeg" width="750" alt="McDonald's Banner"/>
</p>

---

## 🌟 项目亮点与错位创新

在大赛绝大多数项目集中于“单人省钱算券”与“单人点餐”的背景下，**McD Duo Wrapped 另辟蹊径，聚焦麦门社交与双人情感连接**：

1. **👥 首创双人合体年报 (Duo Wrapped)**：
   - 告别千篇一律的单人年度报告！拉上你的情侣、工位邻居、合租室友，一键生成属于你们两个人的麦麦年度合体回忆。
2. **🎯 口味默契度量化引擎**：
   - 从麦当劳真实订单深度提取时段、品类、主食偏好，计算双方的**用餐同频度**与**口味交集**（如：“板烧双子星”、“夜宵合谋者”）。
3. **🔒 零隐私风险的脱敏机制**：
   - 本地生成特征 Profile，不含任何手机号、姓名、地址等敏感信息，支持安全分享。
4. **🍽️ 智能合体餐单闭环**：
   - 报告末尾基于双方偏好公约数，自动生成一份“下次约饭最优拼单建议”，解决聚餐选择困难。

---

## 🚀 快速开始与使用指南

### 前置条件
1. Node.js >= 18.0.0
2. 申请麦当劳官方 MCP Token（前往 [麦当劳开放平台](https://open.mcd.cn/mcp) 手机登录一键申请）

### 1. 配置环境变量
在终端中设置你的 MCP Token：
```bash
# Windows PowerShell
$env:MCD_MCP_TOKEN="你的_MCP_TOKEN"

# macOS / Linux
export MCD_MCP_TOKEN="你的_MCP_TOKEN"
```

### 2. 导出个人脱敏口味画像
在本地终端执行，即可安全导出个人脱敏画像文件：
```bash
npx tsx src/cli.ts export "我的昵称"
# 生成 profile_xxxx.json
```

### 3. 生成双人合体默契报告！
将你和搭子的两个 JSON 档案合并分析：
```bash
npx tsx src/cli.ts compare profile_A.json profile_B.json
```
运行后将自动生成高颜值独立 HTML 报告（可截图分享朋友圈或小红书）：
- **默契契合度评分**（如 96% 麦门绝配神仙搭子）
- **共同最爱餐品最大公约数**
- **生活时段同频指数**
- **专属双人点单推荐建议**

### 4. 离线/现场 DEMO 体验
想立刻体验效果？直接运行 Demo 模式即可将你的真实麦麦足迹与搭子小王进行现场合体：
```bash
npm run demo
```

---

## 📂 赛事合规文件清单

本项目完全遵循大赛官方文件规范：
- `README.md`：项目介绍、快速上手指南与业务场景
- [`CONTEST_DECLARATION.md`](./CONTEST_DECLARATION.md)：官方参赛声明文件（原创性、合规性与无敏感信息声明，内容一字未改）
- [`MCP_INTEGRATION.md`](./MCP_INTEGRATION.md)：麦当劳官方 MCP 工具接入说明、调用链路与业务价值
- [`mcp-config.example.json`](./mcp-config.example.json)：标准脱敏 MCP 配置示例（仅使用环境变量占位符）

---

## 🤝 目标用户群与落地场景

1. **情侣与伴侣**：测一测恋爱/婚姻期间谁更常被对方带去吃麦当劳，谁是夜宵的主谋；
2. **程序员与工位搭子**：加班续命时最默契的咖啡与主食选择；
3. **大学室友与死党**：复盘一学期以来的拼单岁月与聚餐足迹。

---

## 📜 开源协议

本项目采用 MIT 协议开源。
除特别说明外，餐品版权与商标权归麦当劳（中国）所有。
