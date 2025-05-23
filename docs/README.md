# 会话式数据分析代理 POC

## 项目概述

基于 ai-chatbot 框架构建的会话式数据分析代理，通过自然语言对话提供数据分析和可视化功能。

## 核心特性

- 现代聊天界面与流式响应
- 自然语言意图识别
- 交互式图表卡片 (Table/Chart切换)
- 建议查询按钮
- 模拟数据服务（无需后端）

## 技术栈

- **框架**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + Shadcn UI
- **图表**: Recharts
- **动画**: Framer Motion

## 项目状态

✅ **冲刺1完成** (UI基础)
- 项目基础设置和环境配置
- 聊天界面基础功能正常运行

✅ **冲刺2阶段1完成** (数据分析组件)
- 数据分析组件库创建完成
- 建议查询、动态图表、SQL显示、结果展示组件
- UI组件集成 (chart, table, tabs)

🚧 **冲刺2阶段2进行中** (数据服务)
- 模拟数据服务开发
- 意图识别服务
- 聊天界面集成

## 快速开始

```bash
cd ai-chatbot
pnpm install
pnpm dev
```

访问 http://localhost:3000

## 组件架构

```
components/data-analysis/
├── suggested-queries.tsx    # 建议查询按钮
├── dynamic-chart.tsx       # 动态图表 (bar/line/area/pie)
├── query-viewer.tsx        # SQL查询显示
├── data-results.tsx        # Table/Chart切换结果
└── index.ts               # 组件导出
```

## 参考项目

- [AI Chatbot](https://demo.chat-sdk.dev/) - 聊天界面参考
- [Natural Language Postgres](https://natural-language-postgres.vercel.app/) - 数据分析UX参考