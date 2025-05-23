# 开发指南与故障排除

## 🚀 **快速启动**

```bash
cd ai-chatbot
pnpm install
pnpm dev
```

访问 http://localhost:3000

## 🔧 **开发环境配置**

### 环境变量
```env
# .env.local
MOCK_MODE=true
NODE_ENV=development
```

### 性能优化
项目已优化启动速度：
- **优化前**: 30-45秒
- **优化后**: 10-15秒
- **主要优化**: 跳过外部服务连接、禁用遥测、模拟数据服务

## 🧪 **测试功能**

### 支持的查询
```bash
# 数据分析查询
"Compare unicorn valuations in the US vs China"
"Which countries have the highest unicorn density?"
"Show me the top countries with most unicorn companies"

# 其他功能
"Help me write an essay about silicon valley"
"Write code to demonstrate djikstra's algorithm"
```

## ⚠️ **常见问题**

### 1. "Unknown test prompt!" 错误
**原因**: 查询不在预定义的测试提示列表中
**解决**: 使用上述支持的查询示例

### 2. 数据持久化问题
**原因**: 热重载导致内存数据丢失
**解决**: 已实现文件持久化，数据保存在 `.mock-db/documents.json`

### 3. 图表不显示
**原因**: 数据格式或配置问题
**解决**: 检查浏览器控制台错误信息

### 4. 启动缓慢
**原因**: 外部服务连接超时
**解决**: 确保 `MOCK_MODE=true` 环境变量设置正确

## 🔧 **开发技巧**

### 调试模式
```typescript
// 在浏览器控制台查看详细日志
localStorage.setItem('debug', 'true');
```

### 清理缓存
```bash
# 清理 Next.js 缓存
rm -rf .next
pnpm dev
```

### 检查服务状态
```bash
# 检查端口占用
netstat -an | findstr :3000
```

## 🚀 **扩展开发**

### 添加新的查询类型
1. 在 `lib/data-analysis/intent-recognition.ts` 添加新模式
2. 在 `tests/prompts/basic.ts` 添加测试提示
3. 在 `tests/prompts/utils.ts` 添加响应逻辑

### 添加新的图表类型
1. 在 `components/data-analysis/dynamic-chart.tsx` 添加新组件
2. 更新图表配置类型定义
3. 测试新图表的渲染效果

### 集成真实 AI
1. 替换 `tests/prompts/utils.ts` 中的模拟逻辑
2. 配置真实的 AI 模型 API
3. 更新环境变量配置
