# 欢迎使用 NSGM 项目

这是一个由 NSGM CLI 创建的全栈开发项目，集成了 Next.js、Styled-components、GraphQL 和 MySQL 技术栈。

## 技术栈

- [Next.js](https://github.com/vercel/next.js) - React 框架
- [Styled-components](https://github.com/styled-components/styled-components) - CSS-in-JS 解决方案
- [GraphQL](https://graphql.org/) - API 查询语言
- [MySQL](https://www.mysql.com/) - 关系型数据库
- [Jest](https://jestjs.io/) - JavaScript 测试框架
- 安全登录系统 - 基于 bcrypt 加密

## 快速入门

### 开发命令

| 命令             | 说明         |
| ---------------- | ------------ |
| `npm run dev`    | 开发模式     |
| `npm run start`  | 生产模式     |
| `npm run build`  | 编译项目     |
| `npm run export` | 导出静态页面 |

### 测试命令

| 命令                    | 说明             |
| ----------------------- | ---------------- |
| `npm test`              | 运行所有测试     |
| `npm run test:watch`    | 监视模式运行测试 |
| `npm run test:coverage` | 生成覆盖率报告   |

### 代码生成命令

| 命令                    | 说明                  |
| ----------------------- | --------------------- |
| `npm run create`        | 创建模板页面          |
| `npm run delete`        | 删除模板页面          |
| `npm run create-config` | 从配置文件批量创建模块 |
| `npm run delete-config` | 从配置文件批量删除模块 |

### 项目维护命令

| 命令                               | 说明             |
| ---------------------------------- | ---------------- |
| `npm run upgrade`                  | 升级项目基础文件 |
| `npm run generate-password [密码]` | 生成安全密码哈希 |

## 参数说明

### controller

- 用于 `create`/`delete` 命令
- 必填参数
- 示例:
  ```
  npm run create math
  ```

### action

- 用于 `create`/`delete` 命令
- 默认值为 `manage`
- 跟在 controller 参数后面
- 示例:
  ```
  npm run create math test
  ```

### dictionary

- 用于 `export` 命令
- 默认值为 `webapp`
- 示例:
  ```
  npm run export dictionary=webapp
  # 或简化为
  npm run export webapp
  ```

## 项目结构

```
├── __tests__/        # 测试文件
├── components/       # 公共组件
├── pages/            # 页面文件
│   ├── api/          # API 路由
│   └── [controller]/ # 控制器页面
├── public/           # 静态资源
├── server/           # 服务端代码
│   ├── apis/         # REST API 接口
│   ├── modules/      # GraphQL 解析器和模式
│   └── plugins/      # GraphQL 插件
├── styles/           # 全局样式
├── coverage/         # 测试覆盖率报告
├── jest.config.js    # Jest 测试配置
├── next.config.js    # Next.js 配置
├── mysql.config.js   # MySQL 配置
└── project.config.js # 项目配置
```

## 配置文件

### next.config.js

```javascript
const { nextConfig } = require('nsgm-cli')
const projectConfig = require('./project.config')

const { version, prefix, protocol, host } = projectConfig

module.exports = (phase, defaultConfig) => {
  let configObj = nextConfig(phase, defaultConfig, {
    version,
    prefix,
    protocol,
    host
  })

  return configObj
}
```

### mysql.config.js

```javascript
const { mysqlConfig } = require('nsgm-cli')
const { mysqlOptions } = mysqlConfig
const { user, password, host, port, database } = mysqlOptions

module.exports = {
  mysqlOptions: {
    user,
    password,
    host,
    port,
    database
  }
}
```

### project.config.js

```javascript
const { projectConfig } = require('nsgm-cli')
const pkg = require('./package.json')

const { prefix, protocol, host, port } = projectConfig
const { version } = pkg

module.exports = {
  version,
  prefix,
  protocol,
  host,
  port
}
```

## 安全配置

项目集成了安全的登录系统，使用 bcrypt 加密。在部署前请配置登录凭证：

### 快速设置

1. **生成密码哈希**：

   ```bash
   # 使用 npm 脚本
   npm run generate-password yourSecurePassword
   ```

2. **创建环境变量文件**：

   ```bash
   # 在项目根目录创建 .env 文件
   LOGIN_USERNAME=admin
   LOGIN_PASSWORD_HASH=your_generated_hash_here
   ```

3. **确保 .env 文件在 .gitignore 中**（已预配置）

### 详细安全配置

更多安全配置和最佳实践，请参考 [SECURITY.md](./SECURITY.md) 文档。

**⚠️ 重要提醒：**

- 不要在代码中硬编码密码
- 不要将 `.env` 文件提交到版本控制系统
- 定期更换登录密码

## 配置文件批量创建模块

项目支持从 JSON 配置文件批量创建模块，提高开发效率。

### 配置文件位置

配置文件应放置在 `config/` 目录下，例如 `config/modules.json`。

### 配置文件格式

#### 单模块配置

```json
{
  "controller": "product",
  "action": "manage",
  "dictionary": ".",
  "fields": [
    {
      "name": "name",
      "type": "varchar",
      "length": 255,
      "required": true,
      "comment": "商品名称",
      "showInList": true,
      "showInForm": true,
      "searchable": true
    }
  ]
}
```

#### 多模块配置

```json
[
  {
    "controller": "category",
    "action": "manage",
    "dictionary": ".",
    "fields": [...]
  },
  {
    "controller": "product",
    "action": "manage",
    "dictionary": ".",
    "fields": [...]
  }
]
```

项目已提供示例配置文件 `config/modules.json`，包含 `category` 和 `product` 两个模块。

### 使用方法

```bash
# 创建所有模块（使用默认配置文件 config/modules.json）
npm run create-config

# 或指定配置文件路径
nsgm create-config config/modules.json

# 创建指定模块
npm run create-config --module category

# 预览模式（不实际创建）
npm run create-config --dry-run

# 使用自定义配置文件
nsgm create-config path/to/your-config.json
```

### 字段命名规范

**始终使用蛇形命名（snake_case）**：

```json
{
  "name": "user_id",        // ✅ 正确
  "name": "category_id",     // ✅ 正确
  "name": "total_amount",    // ✅ 正确
  "name": "create_date",     // ✅ 正确
  "name": "update_date"      // ✅ 正确
}
```

避免驼峰命名：

```json
{
  "name": "userId",         // ❌ 不推荐
  "name": "categoryId",      // ❌ 不推荐
  "name": "totalAmount",    // ❌ 不推荐
}
```

更多详细信息，请参考项目中的示例配置文件 `config/modules.json`。

## 开发指南

1. **创建新页面**：使用 `npm run create [controller] [action]` 命令
2. **启动开发服务器**：运行 `npm run dev`
3. **运行测试**：使用 `npm test` 运行测试，`npm run test:watch` 进行开发时的实时测试
4. **构建生产版本**：运行 `npm run build` 然后 `npm run start`
5. **导出静态网站**：运行 `npm run export`

### 测试开发

- 测试文件放在 `__tests__/` 目录下
- 测试文件以 `.test.js`、`.test.ts`、`.spec.js` 或 `.spec.ts` 结尾
- 查看测试覆盖率报告：运行 `npm run test:coverage` 后打开 `coverage/index.html`

## 更多资源

更多详细信息，请参考 [NSGM CLI 文档](https://github.com/erishen/nsgm-cli)。
