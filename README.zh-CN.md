# NSGM CLI

[English](README.md) | [简体中文](README.zh-CN.md)

<div align="center">

![NSGM CLI](https://img.shields.io/npm/v/nsgm-cli?style=flat-square&logo=npm)
![License](https://img.shields.io/github/license/erishen/nsgm?style=flat-square)
![Node.js](https://img.shields.io/node/v/nsgm-cli?style=flat-square&logo=node.js)
![Downloads](https://img.shields.io/npm/dm/nsgm-cli?style=flat-square)

**具备智能代码生成能力的全栈开发框架**

</div>

## 🚀 概览

NSGM CLI 是一个完整的全栈开发框架，把现代 Web 技术栈与智能代码生成能力结合在一起：通过交互式 CLI 向导和自动化代码模板，帮助开发者快速搭建可扩展的 Web 应用。

### 🏗️ 架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Next.js       │◄──►│   Express.js    │◄──►│   MySQL         │
│   React         │    │   GraphQL       │    │   Native SQL    │
│   Styled-Comp   │    │   REST API      │    │   Relations     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 核心特性

### 🧙‍♂️ **智能 CLI 向导**

- **模式自适应**：在交互式与命令行模式之间自动切换
- **对新手友好**：一步一步引导完成初始化
- **对老手高效**：熟练开发者可直接用命令行简写

### ⚡ **快速开发**

- **代码生成**：自动生成 CRUD 操作、API 端点与数据库结构
- **配置驱动生成**：从 JSON 配置文件批量创建多个模块
- **热更新**：开发过程即时反馈
- **类型安全**：全栈贯通的 TypeScript 支持

### 🔒 **面向生产的安全能力**

- **CSRF 防护**：内建跨站请求伪造防护
- **密码加密**：基于 bcrypt 的安全认证
- **会话管理**：完善的用户会话处理
- **CSP 头**：内容安全策略实现

### 🏗️ **现代技术栈**

- **前端**：Next.js 13+、React 18+、Styled-components、Redux Toolkit
- **后端**：Express.js、GraphQL、REST API
- **数据库**：MySQL（原生驱动）
- **开发工具**：TypeScript、ESLint、Prettier、Jest

## 📦 安装

### 全局安装（推荐）

```bash
# 使用 npm
npm install -g nsgm-cli

# 使用 yarn
yarn global add nsgm-cli

# 使用 pnpm
pnpm add -g nsgm-cli
```

### 验证安装

```bash
nsgm --version
# 应输出：2.1.47
```

## 🚀 快速开始

### 1. 初始化第一个项目

```bash
# 启动交互式向导（新手推荐）
nsgm init

# 或直接指定项目名
nsgm init my-awesome-app
```

向导会引导你完成：

- ✅ 项目名称与目录
- ✅ 数据库配置
- ✅ 安全设置
- ✅ 初始控制器

### 2. 环境准备

```bash
cd your-project-name

# 复制环境变量模板
cp .env.example .env
```

**默认登录账号**：`admin/admin123`

**修改密码**（可选）：

```bash
# 生成安全密码哈希
pnpm run generate-password yourNewPassword

# 把生成的哈希写入 .env
nano .env
```

### 3. 开始开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

应用将在 `http://localhost:3000` 提供：

- 🎛️ 带 CRUD 界面的管理后台
- 📊 数据导入 / 导出
- 🗑️ 批量操作
- 🔐 安全登录体系（默认：admin/admin123）

## 🛠️ CLI 命令

### 基础命令

| 命令               | 说明             | 模式            | 示例                                   |
| ------------------ | ---------------- | --------------- | -------------------------------------- |
| `nsgm init`        | 初始化新项目     | 交互式 / CLI    | `nsgm init blog-app`                   |
| `nsgm create`      | 生成带 CRUD 的控制器 | 交互式 / CLI | `nsgm create user`                     |
| `nsgm delete`      | 删除控制器及其文件 | 交互式 / CLI  | `nsgm delete product`                  |
| `nsgm create-config` | 按配置文件批量创建 | CLI         | `nsgm create-config config/modules.json` |
| `nsgm delete-config` | 按配置文件批量删除 | CLI         | `nsgm delete-config config/modules.json` |
| `nsgm dev`         | 启动开发服务器   | CLI             | `nsgm dev`                             |
| `nsgm build`       | 生产构建         | CLI             | `nsgm build`                           |
| `nsgm start`       | 启动生产服务器   | CLI             | `nsgm start`                           |

### 进阶命令

```bash
# 数据库操作
nsgm deletedb user           # 删除控制器 + 数据库表

# 批量创建模块
nsgm create-config config/modules.json              # 按配置创建全部模块
nsgm create-config config/modules.json --module category  # 只创建指定模块
nsgm create-config config/modules.json --dry-run        # 预览，不实际创建

# 批量删除模块
nsgm delete-config config/modules.json              # 按配置删除全部模块
nsgm delete-config config/modules.json --module category  # 只删除指定模块
nsgm delete-config config/modules.json --db             # 删除模块并清理数据库表
nsgm delete-config config/modules.json --dry-run        # 预览，不实际删除

# 项目维护
nsgm upgrade                 # 升级项目基础文件
nsgm export                  # 导出静态页面

# 开发工具
pnpm run lint                 # 代码检查
pnpm run test                 # 运行测试
pnpm run test:coverage        # 测试覆盖率报告
```

## 🎨 生成的控制器包含什么

用 `nsgm create` 生成的每个控制器都会带上：

### 🔧 **后端部分**

- **GraphQL Schema**：带类型的 query 与 mutation
- **GraphQL Resolver**：业务逻辑实现
- **REST API 端点**：RESTful 服务层
- **数据库模型**：MySQL 结构定义
- **数据校验**：输入清洗与校验

### 🎯 **前端部分**

- **React 组件**：使用 hooks 的函数式组件
- **Styled Components**：CSS-in-JS 样式
- **Redux 集成**：状态管理
- **表单处理**：新建、编辑与校验表单
- **数据表格**：可排序、可筛选的数据网格

### 📊 **CRUD 能力**

- **增**：带校验的新建记录
- **查**：列表、搜索与分页
- **改**：编辑已有记录
- **删**：单条与批量删除
- **导入 / 导出**：CSV 与 JSON 数据处理

## 🏗️ 项目结构

```
your-project/
├── client/                 # 前端代码
│   ├── components/         # React 组件
│   ├── layout/             # 布局组件
│   ├── redux/              # 状态管理
│   ├── service/            # API 服务
│   ├── styled/             # 样式组件
│   └── utils/              # 工具函数
├── server/                 # 后端代码
│   ├── apis/               # REST API 路由
│   ├── modules/            # GraphQL 模块
│   ├── sql/                # 数据库脚本
│   └── utils/              # 服务端工具
├── pages/                  # Next.js 页面
├── public/                 # 静态资源
├── scripts/                # 构建与部署脚本
├── __tests__/              # 测试文件
├── .env.example            # 环境变量模板
├── next.config.js          # Next.js 配置
├── mysql.config.js         # 数据库配置
└── package.json            # 依赖
```

## ⚙️ 配置

### 环境变量

```bash
# .env 文件
NODE_ENV=development
LOGIN_USERNAME=admin
LOGIN_PASSWORD_HASH=your_generated_hash  # 默认对应 admin123
DATABASE_URL=mysql://user:password@localhost:3306/dbname

# 可选
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 数据库配置

```javascript
// mysql.config.js
module.exports = {
  mysqlOptions: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nsgm_db',
  },
}
```

## 🔒 安全设置

### 默认认证

**默认登录凭据**：`admin/admin123`

### 自定义密码（可选）

```bash
# 为自定义密码生成安全哈希
pnpm run generate-password yourNewPassword

# 写入 .env
LOGIN_PASSWORD_HASH=your_generated_hash_here
```

### CSRF 防护

NSGM CLI 内建 CSRF 防护：

```javascript
// 自动的 CSRF token 生成
app.use(csrfProtection)

// 自定义 CSP 头
app.use(
  createCSPMiddleware({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  })
)
```

## 🧪 测试

```bash
# 运行全部测试
pnpm test

# watch 模式
pnpm run test:watch

# 覆盖率报告
pnpm run test:coverage

# 代码检查
pnpm run lint

# 代码格式化
pnpm run format
```

## 📚 示例

### 搭建一个博客系统

```bash
# 1. 初始化项目
nsgm init my-blog

# 2. 创建控制器
cd my-blog
nsgm create post
nsgm create category
nsgm create user

# 3. 开始开发
pnpm run dev
```

### 新增自定义 API 端点

```javascript
// server/apis/custom.js
const express = require('express')
const router = express.Router()

router.get('/stats', (req, res) => {
  res.json({
    totalPosts: 42,
    totalUsers: 15,
    lastUpdate: new Date(),
  })
})

module.exports = router
```

### 自定义 GraphQL Schema

```javascript
// server/modules/blog/schema.js
module.exports = {
  query: `
    posts(limit: Int, offset: Int): [Post]
    post(id: ID!): Post
  `,
  mutation: `
    createPost(title: String!, content: String!): Post
    updatePost(id: ID!, title: String, content: String): Post
    deletePost(id: ID!): Boolean
  `,
  type: `
    type Post {
      id: ID!
      title: String!
      content: String!
      createdAt: Date!
      updatedAt: Date!
    }
  `,
}
```

## 🚀 性能与生产部署

### 构建优化

```bash
# 生产构建
pnpm run build

# 分析包体积
pnpm run analyze

# 导出静态站点
pnpm run export
```

### 生产部署

#### 本地部署

```bash
# 启动生产服务器
pnpm start

# 或使用 PM2
pm2 start pnpm --name "nsgm-app" -- start
```

#### Vercel 部署（推荐）

NSGM CLI 完全支持 Vercel 部署，包括自动化 CI/CD 流程。

**快速开始：**

1. 推送项目到 GitHub
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 导入 GitHub 仓库
4. 配置环境变量（以仓库内的 `.env.example` 为模板逐键填入）
5. 点击 "Deploy"

**详细指南：** 查看 [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

**特性：**

- ✅ 自动 CI/CD 流程
- ✅ 预览环境（每个 PR）
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 无服务器函数
- ✅ 一键回滚

**环境变量配置：**

```
NODE_ENV=production
LOGIN_USERNAME=admin
LOGIN_PASSWORD_HASH=your_hash
DATABASE_URL=mysql://...
```

**获取密码哈希：**

```bash
pnpm run generate-password yourPassword
```

## 📖 文档

- [安全说明](SECURITY.md)：安全相关的注意事项与最佳实践
- [配置驱动生成实现说明](docs/CONFIG-CMD-IMPLEMENTATION.md)：从配置文件批量生成模块的实现
- [配置驱动生成使用指南](docs/CREATE-FROM-CONFIG.md)：`create-config` / `delete-config` 的用法
- [Prisma 迁移指南](docs/prisma-migration-guide.md)：数据库迁移相关说明
- [开发手册](DEVELOP.md)：在本仓做开发时用到的命令与流程

### 相关文章

- [NSGM CLI](https://erishen.cn/nsgm-cli/) —— 本项目的中文介绍文章（erishen.cn）。

## 📋 基于配置文件的生成

NSGM CLI 支持从 JSON 配置文件批量创建模块，一次生成多个模块。

### 配置文件格式

创建一个 JSON 文件（例如 `config/modules.json`）描述你的模块：

```json
[
  {
    "controller": "category",
    "action": "manage",
    "dictionary": ".",
    "fields": [
      {
        "name": "id",
        "type": "integer",
        "required": true,
        "comment": "Primary key",
        "isPrimaryKey": true,
        "isAutoIncrement": true
      },
      {
        "name": "name",
        "type": "varchar",
        "length": 100,
        "required": true,
        "comment": "Category name",
        "showInList": true,
        "showInForm": true,
        "searchable": true
      }
    ]
  }
]
```

### 用法示例

```bash
# 按配置创建全部模块
nsgm create-config config/modules.json

# 或使用 npm script 走默认配置
pnpm run create-config

# 只创建指定模块
nsgm create-config config/modules.json --module category

# 预览模式（dry-run）
nsgm create-config config/modules.json --dry-run
```

### 字段命名约定

**字段名一律使用 snake_case：**

```json
{
  "name": "user_id",        // ✅ 正确
  "name": "category_id",    // ✅ 正确
  "name": "total_amount",   // ✅ 正确
  "name": "create_date",    // ✅ 正确
  "name": "update_date"     // ✅ 正确
}
```

避免 camelCase：

```json
{
  "name": "userId",         // ❌ 不推荐
  "name": "categoryId",     // ❌ 不推荐
  "name": "totalAmount",    // ❌ 不推荐
}
```

### 配置文件位置

生成的项目自带 `config/` 目录与示例配置：

```
project/
├── config/
│   ├── modules.json            # 默认模块配置
│   └── your-custom-config.json # 你的自定义配置
├── server/
├── client/
└── ...
```

## 🐛 常见问题

**端口被占用**

```bash
# 结束占用 3000 端口的进程
lsof -ti:3000 | xargs kill -9

# 或换一个端口
PORT=3001 pnpm run dev
```

**数据库连接失败**

```bash
# 检查 MySQL 服务
sudo systemctl status mysql

# 核对 .env 里的凭据
cat .env | grep DB_
```

**权限报错**

```bash
# 修复 npm 权限
sudo chown -R $(whoami) ~/.npm

# 或换一个安装位置
npm config set prefix '~/.local'
```

## 📄 许可证

许可证条款以仓库根目录的 [LICENSE](LICENSE) 文件为准。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [GraphQL](https://graphql.org/) - 查询语言
- [Styled Components](https://styled-components.com/) - CSS-in-JS
- [MySQL](https://www.mysql.com/) - 关系型数据库

---

<div align="center">

**Made with ❤️ by the NSGM Team**

[GitHub](https://github.com/erishen/nsgm) • [npm](https://www.npmjs.com/package/nsgm-cli) • [Issues](https://github.com/erishen/nsgm/issues)

</div>
