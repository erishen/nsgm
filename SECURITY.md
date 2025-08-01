# 安全配置指南

## 登录系统安全配置

### 1. 设置登录凭证

系统使用环境变量来管理登录凭证，确保安全性。

#### 生成密码哈希

```bash
# 生成密码哈希
npm run generate-password mySecurePassword123

# 或者直接使用脚本
node scripts/generate-password-hash.js mySecurePassword123
```

#### 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# 复制示例配置文件
cp .env.example .env
```

编辑 `.env` 文件，设置登录凭证：

```bash
# 登录配置
LOGIN_USERNAME=admin
LOGIN_PASSWORD_HASH=$2b$10$your_generated_hash_here
```

### 2. 安全最佳实践

#### ✅ 应该做的：

1. **使用强密码**
   - 至少 12 个字符
   - 包含大小写字母、数字和特殊字符
   - 避免使用常见密码

2. **保护环境变量**
   - 不要将 `.env` 文件提交到版本控制
   - 在生产环境中使用环境变量或密钥管理服务
   - 定期轮换密码

3. **监控登录活动**
   - 检查服务器日志中的登录失败记录
   - 实施登录失败限制（如有需要）

#### ❌ 不应该做的：

1. **不要硬编码凭证**
   - 不要在代码中直接写入用户名密码
   - 不要使用默认或简单密码

2. **不要忽略安全警告**
   - 如果看到 "LOGIN_PASSWORD_HASH 环境变量未设置" 警告，立即配置

### 3. 生产环境部署

#### Docker 部署

```dockerfile
# Dockerfile 中设置环境变量
ENV LOGIN_USERNAME=admin
ENV LOGIN_PASSWORD_HASH=$2b$10$your_generated_hash_here
```

#### PM2 部署

```json
{
  "name": "nsgm-app",
  "script": "app.js",
  "env": {
    "LOGIN_USERNAME": "admin",
    "LOGIN_PASSWORD_HASH": "$2b$10$your_generated_hash_here"
  }
}
```

#### 云服务部署

大多数云服务提供商（如 Heroku、Vercel、AWS 等）都支持环境变量配置。

### 4. 故障排除

#### 常见问题：

1. **登录失败**
   - 检查 `.env` 文件是否存在
   - 确认 `LOGIN_PASSWORD_HASH` 格式正确
   - 查看服务器日志获取详细错误信息

2. **环境变量未生效**
   - 重启应用程序
   - 确认 `.env` 文件在项目根目录
   - 检查环境变量名称是否正确

#### 重置密码：

```bash
# 1. 生成新的密码哈希
npm run generate-password newPassword123

# 2. 更新 .env 文件中的 LOGIN_PASSWORD_HASH

# 3. 重启应用
npm restart
```

### 5. 安全检查清单

- [ ] `.env` 文件已配置且不在版本控制中
- [ ] 使用强密码
- [ ] 密码已进行哈希处理
- [ ] 定期检查登录日志
- [ ] 生产环境使用安全的环境变量管理
- [ ] 定期更换密码

---

**⚠️ 重要提醒：**

- 永远不要在代码中硬编码密码
- 确保 `.env` 文件在 `.gitignore` 中
- 定期更新和轮换登录凭证
