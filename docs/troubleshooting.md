# 故障排除与优化指南

本文档记录了项目中常见问题的解决方案和性能优化措施。

## 常见错误及修复

### 导入错误

**问题**：缺少必要的函数导出
```
Attempted import error: 'getMessageCountByUserId' is not exported from '@/lib/db/queries'
```

**解决方案**：在`lib/db/mock-db.ts`中添加缺失的函数实现
```typescript
export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    // 返回模拟数据
    return 5;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get message count',
    );
  }
}
```

### API路由错误

**问题**：路由处理程序未返回响应
```
Error: No response is returned from route handler 'route.ts'
```

**解决方案**：确保所有错误处理分支都返回响应
```typescript
} catch (error) {
  if (error instanceof ChatSDKError) {
    return error.toResponse();
  }
  // 处理其他错误
  console.error('Unexpected error in chat API:', error);
  return new ChatSDKError('internal_server_error:chat').toResponse();
}
```

### 错误类型缺失

**问题**：使用了未定义的错误类型

**解决方案**：在`lib/errors.ts`中添加新的错误类型
```typescript
export type ErrorType =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limit'
  | 'offline'
  | 'internal_server_error'; // 新增

// 在getStatusCodeByType函数中添加对应处理
case 'internal_server_error':
  return 500;
```

## 启动速度优化

### 问题分析

1. **Vercel OTel 遥测初始化**：增加启动时间约2-3秒
2. **Redis连接尝试**：连接超时导致启动延迟约5-10秒
3. **Vercel函数依赖**：增加启动时间约1-2秒
4. **字体预加载**：增加启动时间约1秒

### 优化措施

#### 1. 条件性禁用Vercel遥测

**文件**: `instrumentation.ts`
```typescript
import { registerOTel } from '@vercel/otel';
import { isMockMode } from '@/lib/constants';

export function register() {
  // 在mock模式下跳过遥测初始化
  if (!isMockMode) {
    registerOTel({ serviceName: 'ai-chatbot' });
  }
}
```

#### 2. 优化Redis连接

**文件**: `app/(chat)/api/chat/route.ts`
```typescript
function getStreamContext() {
  // 在mock模式下跳过可恢复流
  if (isMockMode) {
    return null;
  }
  // ... 原有逻辑
}
```

#### 3. 模拟地理位置服务

**文件**: `app/(chat)/api/chat/route.ts`
```typescript
// 在mock模式下使用模拟地理位置数据
const geoData = isMockMode 
  ? { longitude: null, latitude: null, city: null, country: null }
  : geolocation(request);
```

#### 4. 禁用字体预加载

**文件**: `app/layout.tsx`
```typescript
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  preload: false, // 禁用预加载以提高启动速度
});
```

### 环境变量配置

确保在`.env`文件中设置：
```env
MOCK_MODE=true
NODE_ENV=development
```

### 优化效果

- **优化前**：启动时间约30-45秒
- **优化后**：启动时间约10-15秒
- **改进**：减少约20-30秒启动时间

## 性能监控

### 使用时间戳监控

```typescript
console.time('App Startup');
// ... 初始化代码
console.timeEnd('App Startup');
```

### 检查端口占用

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

### 浏览器访问测试

直接访问 `http://localhost:3000` 验证服务是否正常启动。

## 经验总结

### 1. Mock实现的重要性
在隔离外部依赖时，必须确保所有被引用的函数都有对应的mock实现，否则会导致编译错误。

### 2. 错误处理的完整性
API路由中的错误处理必须覆盖所有可能的代码路径，确保每个分支都返回有效的响应。

### 3. 类型定义的一致性
使用自定义错误类型时，必须确保类型定义和实现保持一致。

### 4. 构建缓存的影响
在进行大量代码修改后，清理构建缓存可以避免一些奇怪的编译问题。

## 后续优化方向

1. **懒加载组件**：对非关键组件实现懒加载
2. **缓存优化**：实现本地缓存机制
3. **代码分割**：按功能模块分割代码
