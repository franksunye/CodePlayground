# 会话式数据分析代理 POC

## 项目概述

基于 ai-chatbot 框架构建的会话式数据分析代理，通过自然语言对话提供数据分析和可视化功能。

## 🎉 当前状态：**完整功能已实现** (v1.0.0-data-analysis)

✅ **完整的聊天式数据分析体验**
- 自然语言查询识别和处理
- 交互式图表和数据可视化
- 统一的 Artifact 面板体验
- 模拟数据服务（独角兽公司数据集）

## 核心特性

### 🗣️ **自然语言交互**
- 支持多种数据查询类型（比较、排名、密度分析等）
- 智能意图识别和参数提取
- 流式响应和实时反馈

### 📊 **数据可视化**
- 动态图表生成（柱状图、饼图、折线图等）
- 交互式数据表格
- 可展开的数据结果面板
- SQL 查询透明化显示

### 🎨 **用户体验**
- 与代码/文本 Artifact 一致的界面体验
- 响应式设计和流畅动画
- 建议查询和探索引导

## 技术栈

- **框架**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + Shadcn UI + Framer Motion
- **图表**: Recharts
- **数据**: Mock 数据服务 + 文件持久化
- **AI**: 模拟 AI 响应系统

## 快速开始

```bash
cd ai-chatbot
pnpm install
pnpm dev
```

访问 http://localhost:3000

## 🧪 **测试查询示例**

以下查询已完全支持：

```
✅ "Compare unicorn valuations in the US vs China"
✅ "Which countries have the highest unicorn density?"
✅ "Show me the top countries with most unicorn companies"
✅ "Help me write an essay about silicon valley"
✅ "Write code to demonstrate djikstra's algorithm"
```

## 🏗️ **架构概览**

### 数据分析流程
```
用户查询 → 意图识别 → SQL生成 → 数据检索 → 图表配置 → 可视化渲染
```

### 核心组件
```
lib/data-analysis/
├── index.ts                 # 主服务入口
├── intent-recognition.ts    # 意图识别引擎
├── sql-generator.ts         # SQL查询生成
└── mock-data.ts            # 模拟数据服务

artifacts/data/
├── client.tsx              # 数据 Artifact 客户端
└── server.ts               # 数据 Artifact 服务端

components/data-analysis/
├── dynamic-chart.tsx       # 动态图表组件
├── data-results.tsx        # 数据结果展示
├── query-viewer.tsx        # SQL查询显示
└── suggested-queries.tsx   # 建议查询按钮
```

## 🚀 **下一步计划**

- [ ] 集成真实 AI 模型（替换模拟响应）
- [ ] 连接真实数据源
- [ ] 增加更多图表类型和交互功能
- [ ] 部署到生产环境

## 📚 **文档导航**

- **[项目计划](./project-plan.md)** - 完整的项目规划和冲刺回顾
- **[技术指南](./technical-guide.md)** - 系统架构和技术实现详解
- **[项目状态](./task-execution-plan.md)** - 当前完成状态和成果总结
- **[开发指南](./troubleshooting.md)** - 快速启动和故障排除

## 📚 **参考项目**

- [AI Chatbot](https://demo.chat-sdk.dev/) - 聊天界面和 Artifact 体验参考
- [Natural Language Postgres](https://natural-language-postgres.vercel.app/) - 数据分析 UX 参考

## 🏷️ **版本信息**

- **当前版本**: v1.0.0-data-analysis
- **GitHub**: https://github.com/franksunye/CodePlayground/tree/direct-copy-approach
- **发布标签**: https://github.com/franksunye/CodePlayground/releases/tag/v1.0.0-data-analysis