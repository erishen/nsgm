# Vercel 部署指南

本文档说明如何将 NSGM CLI 生成的项目部署到 Vercel。

## 前置条件

- Vercel 账户（免费注册：https://vercel.com）
- GitHub 账户（推荐用于自动部署）
- 项目已上传到 GitHub

## 部署步骤

### 1. 连接 GitHub 仓库

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 授权 Vercel 访问你的 GitHub 账户
5. 选择你的项目仓库

### 2. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
NODE_ENV=production
LOGIN_USERNAME=admin
LOGIN_PASSWORD_HASH=your_generated_hash
DATABASE_URL=mysql://user:password@host:port/database
```

**获取 PASSWORD_HASH：**

```bash
npm run generate-password yourPassword
```

### 3. 数据库配置

#### 使用 PlanetScale（推荐）

PlanetScale 是 MySQL 兼容的无服务器数据库，完美适配 Vercel：

1. 注册 [PlanetScale](https://planetscale.com)
2. 创建新数据库
3. 获取连接字符串
4. 在 Vercel 环境变量中设置 `DATABASE_URL`

#### 使用其他 MySQL 服务

- AWS RDS
- DigitalOcean Managed Databases
- Heroku Postgres（需要 MySQL 驱动）
- 自建 MySQL 服务器

### 4. 部署配置

项目已包含 `vercel.json` 配置文件，包含：

- **buildCommand**: 编译 TypeScript 并构建 Next.js
- **outputDirectory**: `.next` 目录
- **functions**: 服务器函数配置
- **routes**: API 路由映射

### 5. 自动部署

配置完成后，每次推送到 GitHub 主分支时，Vercel 会自动：

1. 拉取最新代码
2. 安装依赖
3. 运行构建命令
4. 部署到 Vercel CDN

## 部署后验证

### 检查构建日志

1. 进入 Vercel 项目
2. 点击最新的部署
3. 查看 "Build Logs" 确保没有错误

### 测试应用

1. 访问提供的 Vercel URL
2. 使用默认凭证登录：`admin/admin123`
3. 测试 CRUD 操作

### 常见问题排查

**构建失败：找不到模块**

```bash
# 确保所有依赖都在 package.json 中
npm install missing-package --save
git push
```

**数据库连接失败**

```bash
# 验证 DATABASE_URL 环境变量
# 检查数据库是否允许 Vercel IP 访问
# 对于 PlanetScale，需要在 Vercel 中配置 IP 白名单
```

**超时错误**

- 增加 Vercel 函数超时时间（Pro 计划支持）
- 优化数据库查询
- 使用连接池

## 性能优化

### 1. 启用缓存

```javascript
// next.config.js
module.exports = {
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
}
```

### 2. 图片优化

```javascript
// 使用 Next.js Image 组件
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/image.jpg"
      alt="Description"
      width={500}
      height={300}
    />
  )
}
```

### 3. 数据库连接池

```javascript
// server/utils/db.js
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = pool
```

## 监控和日志

### 实时日志

```bash
# 使用 Vercel CLI 查看实时日志
vercel logs --follow
```

### 错误追踪

集成 Sentry 进行错误监控：

```bash
npm install @sentry/nextjs
```

```javascript
// pages/_app.tsx
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})
```

## 自定义域名

1. 在 Vercel 项目设置中进入 "Domains"
2. 添加你的域名
3. 按照说明更新 DNS 记录
4. 等待 DNS 传播（通常 24 小时内）

## 回滚部署

如果部署出现问题：

1. 进入 Vercel 项目的 "Deployments" 标签
2. 找到之前的稳定版本
3. 点击 "Promote to Production"

## 环境隔离

### 预览环境

- 自动为每个 Pull Request 创建预览 URL
- 用于测试和审查
- 不影响生产环境

### 生产环境

- 仅从主分支部署
- 需要通过所有检查
- 自动 HTTPS 和 CDN 加速

## 成本考虑

Vercel 免费计划包括：

- ✅ 无限制的静态站点
- ✅ 无限制的 Serverless 函数调用
- ✅ 1GB 带宽/月
- ✅ 自动 HTTPS
- ✅ 全球 CDN

付费计划提供：

- 更高的带宽限制
- 优先支持
- 高级分析

## 故障排除

### 问题：502 Bad Gateway

**原因**：服务器错误或超时

**解决**：
1. 检查构建日志
2. 验证环境变量
3. 检查数据库连接

### 问题：静态文件 404

**原因**：文件未包含在构建中

**解决**：
1. 确保文件在 `public/` 目录
2. 检查 `.vercelignore` 配置
3. 清除缓存并重新部署

### 问题：环境变量未生效

**原因**：变量未正确设置或拼写错误

**解决**：
1. 检查 Vercel 环境变量设置
2. 确保变量名称正确
3. 重新部署以应用更改

## 更多资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [PlanetScale 文档](https://planetscale.com/docs)
- [Vercel CLI 参考](https://vercel.com/cli)

## 支持

如有问题，请：

1. 查看 [Vercel 状态页面](https://www.vercelstatus.com/)
2. 提交 [GitHub Issue](https://github.com/erishen/nsgm/issues)
3. 联系 [Vercel 支持](https://vercel.com/support)
