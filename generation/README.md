# 欢迎使用 NSGM 项目

这是一个由 NSGM CLI 创建的全栈开发项目，集成了 Next.js、Styled-components、GraphQL 和 MySQL 技术栈。

## 技术栈

- [Next.js](https://github.com/vercel/next.js) - React 框架
- [Styled-components](https://github.com/styled-components/styled-components) - CSS-in-JS 解决方案
- [GraphQL](https://graphql.org/) - API 查询语言
- [MySQL](https://www.mysql.com/) - 关系型数据库
- 安全登录系统 - 基于 bcrypt 加密

## 快速入门

### 开发命令

| 命令             | 说明         |
| ---------------- | ------------ |
| `npm run dev`    | 开发模式     |
| `npm run start`  | 生产模式     |
| `npm run build`  | 编译项目     |
| `npm run export` | 导出静态页面 |

### 代码生成命令

| 命令             | 说明         |
| ---------------- | ------------ |
| `npm run create` | 创建模板页面 |
| `npm run delete` | 删除模板页面 |

### 项目维护命令

| 命令                                | 说明             |
| ----------------------------------- | ---------------- |
| `npm run upgrade`                   | 升级项目基础文件 |
| `npm run generate-password [密码]`  | 生成安全密码哈希 |

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

### password

- 用于 `generate-password` 命令
- 可选参数
- 示例:
  ```
  npm run generate-password yourSecurePassword
  ```

## 项目结构

```
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
   
   # 或直接使用 nsgm 命令
   npx nsgm password yourSecurePassword
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

## 开发指南

1. **创建新页面**：使用 `npm run create [controller] [action]` 命令
2. **启动开发服务器**：运行 `npm run dev`
3. **构建生产版本**：运行 `npm run build` 然后 `npm run start`
4. **导出静态网站**：运行 `npm run export`

## 更多资源

更多详细信息，请参考 [NSGM CLI 文档](https://github.com/erishen/nsgm-cli)。
