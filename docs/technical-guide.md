# 技术指南

## 系统架构

会话式数据分析代理是一个基于Next.js的前端应用，结合聊天界面和数据可视化功能。

### 架构图

```
+----------------------------------+
|           Next.js App            |
+----------------------------------+
|  +-------------+  +------------+ |
|  | 聊天界面组件 |  | 数据可视化  | |
|  |             |  |   组件     | |
|  +------+------+  +-----+------+ |
+---------|---------------|--------+
          |               |
          v               v
+----------------------------------+
|           客户端服务              |
+----------------------------------+
| +------------+  +-------------+  |
| | 意图识别服务 |  | 模拟数据服务  |  |
| | 模拟AI响应  |  | 图表配置生成  |  |
| +------------+  +-------------+  |
+----------------------------------+
```

## 核心组件

### 1. 聊天界面组件
- **Chat容器**：管理整体聊天状态和布局
- **Messages组件**：显示消息历史
- **Message组件**：渲染单个消息（文本或图表）
- **ChatInput组件**：处理用户输入

### 2. 数据可视化组件
- **ChartMessage组件**：在聊天流中显示图表
- **DynamicChart组件**：根据数据类型渲染不同图表
- **ChartTypeSelector组件**：允许用户切换图表类型
- **ChartModal组件**：显示详细图表视图
- **DataTable组件**：表格形式显示数据

### 3. 客户端服务
- **意图识别服务**：识别用户查询中的数据分析意图
- **模拟数据服务**：提供预定义的数据集和查询功能
- **模拟AI响应服务**：生成AI响应
- **图表配置生成服务**：根据数据特性生成图表配置

## 数据流

1. 用户在ChatInput中输入查询
2. 查询发送到意图识别服务
3. 如果识别为数据分析意图：
   - 从模拟数据服务获取相关数据
   - 图表配置生成服务创建适当的图表配置
   - 返回包含图表数据的响应
4. 如果识别为普通对话：
   - 模拟AI响应服务生成文本响应
5. 响应在Messages组件中显示

## 文件结构

```
ai-chatbot/
├── app/                  # Next.js App Router
│   ├── api/              # API路由
│   │   └── chat/         # 聊天API
│   ├── (chat)/           # 聊天相关页面
│   └── layout.tsx        # 根布局
├── components/           # React组件
│   ├── chat/             # 聊天相关组件
│   ├── chart/            # 图表相关组件
│   └── ui/               # UI组件
├── lib/                  # 工具函数和服务
│   ├── intent-recognition.ts  # 意图识别
│   ├── mock-data.ts      # 模拟数据
│   ├── chart-service.ts  # 图表服务
│   └── types.ts          # 类型定义
└── public/               # 静态资源
```

## 参考项目分析

### Vercel AI Chatbot
**借鉴要点**：
- 聊天界面架构和组件结构
- 流式响应处理和打字机效果
- Shadcn UI组件使用方式
- 状态管理方法

### Natural Language Postgres
**借鉴要点**：
- 图表组件在聊天流中的嵌入方式
- 图表类型自动选择逻辑
- 交互式数据探索功能
- 查询处理和结果展示方式

## 关键技术实现

### 1. 模拟AI响应
```typescript
// app/api/chat/route.ts
export async function POST(request: Request) {
  // 意图识别
  const intent = recognizeIntent(message);
  
  if (intent.type === 'data_analysis') {
    // 生成图表响应
    const chartData = generateChartData(intent);
    return streamResponse(chartData);
  } else {
    // 生成文本响应
    return streamResponse(generateTextResponse(message));
  }
}
```

### 2. 图表消息组件
```typescript
// components/chat/chart-message.tsx
export function ChartMessage({ data, type }) {
  return (
    <div className="chart-container">
      <DynamicChart data={data} type={type} />
      <ChartTypeSelector onTypeChange={handleTypeChange} />
    </div>
  );
}
```

### 3. 意图识别
```typescript
// lib/intent-recognition.ts
export function recognizeIntent(message: string) {
  const patterns = {
    sales_trend: /销售.*趋势|sales.*trend/i,
    user_analysis: /用户.*分析|user.*analysis/i,
    product_comparison: /产品.*比较|product.*comparison/i
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(message)) {
      return { type, confidence: 0.8 };
    }
  }
  
  return { type: 'general', confidence: 0.5 };
}
```

## 性能优化

1. **组件懒加载**：图表组件使用懒加载减少初始加载时间
2. **状态优化**：使用React.memo和useMemo优化重渲染
3. **数据处理优化**：在客户端高效处理数据
4. **启动优化**：条件性跳过外部服务连接

## 开发环境配置

### 环境变量
```env
MOCK_MODE=true
NODE_ENV=development
```

### 启动优化
- 禁用Vercel遥测
- 跳过Redis连接
- 使用模拟地理位置服务
- 禁用字体预加载

## 扩展性考虑

1. **模块化组件**：组件设计遵循单一职责原则
2. **清晰的接口**：组件和服务之间通过明确的接口通信
3. **可插拔的图表类型**：图表系统设计为可以轻松添加新图表类型
4. **可扩展的数据模型**：数据模型设计为可以支持更多类型的数据和分析
