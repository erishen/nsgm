# NSGM CLI

<div align="center">

![NSGM CLI](https://img.shields.io/npm/v/nsgm-cli?style=flat-square&logo=npm)
![License](https://img.shields.io/github/license/erishen/nsgm?style=flat-square)
![Node.js](https://img.shields.io/node/v/nsgm-cli?style=flat-square&logo=node.js)
![Downloads](https://img.shields.io/npm/dm/nsgm-cli?style=flat-square)

**A powerful full-stack development framework with intelligent code generation**

[Installation](#installation) • [Quick Start](#quick-start) • [Features](#features) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

## 🚀 Overview

NSGM CLI is a comprehensive full-stack development framework that combines the power of modern web technologies with intelligent code generation capabilities. It helps developers rapidly build scalable web applications through an interactive CLI wizard and automated code templates.

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Next.js       │◄──►│   Express.js    │◄──►│   MySQL         │
│   React         │    │   GraphQL       │    │   Native SQL    │
│   Styled-Comp   │    │   REST API      │    │   Relations     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Key Features

### 🧙‍♂️ **Intelligent CLI Wizard**

- **Smart Mode Detection**: Automatically switches between interactive and command-line modes
- **Beginner-Friendly**: Step-by-step guided setup for newcomers
- **Expert-Efficient**: Quick command-line shortcuts for experienced developers

### ⚡ **Rapid Development**

- **Code Generation**: Automatic CRUD operations, API endpoints, and database schemas
- **Config-Based Generation**: Batch create multiple modules from JSON configuration files
- **Hot Reload**: Instant development feedback
- **Type Safety**: Full TypeScript support throughout the stack

### 🔒 **Production-Ready Security**

- **CSRF Protection**: Built-in cross-site request forgery prevention
- **Password Encryption**: bcrypt-based secure authentication
- **Session Management**: Robust user session handling
- **CSP Headers**: Content Security Policy implementation

### 🏗️ **Modern Tech Stack**

- **Frontend**: Next.js 13+, React 18+, Styled-components, Redux Toolkit
- **Backend**: Express.js, GraphQL, REST APIs
- **Database**: MySQL with native drivers
- **DevTools**: TypeScript, ESLint, Prettier, Jest

## 📦 Installation

### Global Installation (Recommended)

```bash
# Using npm
npm install -g nsgm-cli

# Using yarn
yarn global add nsgm-cli

# Using pnpm
pnpm add -g nsgm-cli
```

### Verify Installation

```bash
nsgm --version
# Should output: 2.1.47
```

## 🚀 Quick Start

### 1. Initialize Your First Project

```bash
# Start the interactive wizard (recommended for beginners)
nsgm init

# Or specify project name directly
nsgm init my-awesome-app
```

The wizard will guide you through:

- ✅ Project name and directory
- ✅ Database configuration
- ✅ Security settings
- ✅ Initial controller setup

### 2. Environment Setup

```bash
cd your-project-name

# Copy environment template
cp .env.example .env
```

**Default Login**: `admin/admin123`

**To change password** (optional):

```bash
# Generate secure password hash
pnpm run generate-password yourNewPassword

# Edit .env file with generated hash
nano .env
```

### 3. Start Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Your application will be available at `http://localhost:3000` with:

- 🎛️ Admin dashboard with CRUD interface
- 📊 Data import/export functionality
- 🗑️ Batch operations support
- 🔐 Secure login system (Default: admin/admin123)

## 🛠️ CLI Commands

### Core Commands

| Command           | Description                     | Mode            | Example                       |
| ---------------- | ------------------------------- | --------------- | ----------------------------- |
| `nsgm init`      | Initialize new project          | Interactive/CLI | `nsgm init blog-app`         |
| `nsgm create`    | Generate controller with CRUD   | Interactive/CLI | `nsgm create user`           |
| `nsgm delete`    | Remove controller and files     | Interactive/CLI | `nsgm delete product`        |
| `nsgm create-config` | Batch create from config file | CLI             | `nsgm create-config config/modules.json` |
| `nsgm delete-config` | Batch delete from config file | CLI             | `nsgm delete-config config/modules.json` |
| `nsgm dev`       | Start development server        | CLI             | `nsgm dev`                   |
| `nsgm build`     | Build for production           | CLI             | `nsgm build`                 |
| `nsgm start`     | Start production server        | CLI             | `nsgm start`                 |

### Advanced Commands

```bash
# Database operations
nsgm deletedb user           # Delete controller + database table

# Batch module creation
nsgm create-config config/modules.json              # Create all modules from config
nsgm create-config config/modules.json --module category  # Create specific module
nsgm create-config config/modules.json --dry-run        # Preview without creating

# Batch module deletion
nsgm delete-config config/modules.json              # Delete all modules from config
nsgm delete-config config/modules.json --module category  # Delete specific module
nsgm delete-config config/modules.json --db             # Delete modules + database tables
nsgm delete-config config/modules.json --dry-run        # Preview without deleting

# Project maintenance
nsgm upgrade                 # Upgrade project base files
nsgm export                  # Export static pages

# Development tools
pnpm run lint                 # Code linting
pnpm run test                 # Run tests
pnpm run test:coverage        # Test coverage report
```

## 🎨 Generated Controller Features

Each controller created with `nsgm create` includes:

### 🔧 **Backend Components**

- **GraphQL Schema**: Typed queries and mutations
- **GraphQL Resolvers**: Business logic implementation
- **REST API Endpoints**: RESTful service layer
- **Database Models**: MySQL schema definitions
- **Data Validation**: Input sanitization and validation

### 🎯 **Frontend Components**

- **React Components**: Modern functional components with hooks
- **Styled Components**: CSS-in-JS styling
- **Redux Integration**: State management
- **Form Handling**: Create, edit, and validation forms
- **Data Tables**: Sortable, filterable data grids

### 📊 **CRUD Operations**

- **Create**: Add new records with validation
- **Read**: List, search, and pagination
- **Update**: Edit existing records
- **Delete**: Single and batch deletion
- **Import/Export**: CSV and JSON data handling

## 🏗️ Project Structure

```
your-project/
├── client/                 # Frontend code
│   ├── components/         # React components
│   ├── layout/            # Layout components
│   ├── redux/             # State management
│   ├── service/           # API services
│   ├── styled/            # Styled components
│   └── utils/             # Utility functions
├── server/                # Backend code
│   ├── apis/              # REST API routes
│   ├── modules/           # GraphQL modules
│   ├── sql/               # Database scripts
│   └── utils/             # Server utilities
├── pages/                 # Next.js pages
├── public/                # Static assets
├── scripts/               # Build and deployment scripts
├── __tests__/             # Test files
├── .env.example           # Environment template
├── next.config.js         # Next.js configuration
├── mysql.config.js        # Database configuration
└── package.json           # Dependencies
```

## ⚙️ Configuration

### Environment Variables

```bash
# .env file
NODE_ENV=development
LOGIN_USERNAME=admin
LOGIN_PASSWORD_HASH=your_generated_hash  # Default: admin123
DATABASE_URL=mysql://user:password@localhost:3306/dbname

# Optional
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Database Configuration

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

## 🔒 Security Setup

### Default Authentication

**Default Login Credentials**: `admin/admin123`

### Custom Password Setup (Optional)

```bash
# Generate secure hash for custom password
pnpm run generate-password yourNewPassword

# Add to .env file
LOGIN_PASSWORD_HASH=your_generated_hash_here
```

### CSRF Protection

NSGM CLI includes built-in CSRF protection:

```javascript
// Automatic CSRF token generation
app.use(csrfProtection)

// Custom CSP headers
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

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:coverage

# Lint code
pnpm run lint

# Format code
pnpm run format
```

## 📚 Examples

### Creating a Blog System

```bash
# 1. Initialize project
nsgm init my-blog

# 2. Create controllers
cd my-blog
nsgm create post
nsgm create category
nsgm create user

# 3. Start development
pnpm run dev
```

### Adding Custom API Endpoint

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

### Custom GraphQL Schema

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

## 🚀 Performance & Production

### Build Optimization

```bash
# Production build
pnpm run build

# Analyze bundle size
pnpm run analyze

# Export static site
pnpm run export
```

### Production Deployment

#### Local Deployment

```bash
# Start production server
pnpm start

# Or use PM2
pm2 start pnpm --name "nsgm-app" -- start
```

#### Vercel Deployment (Recommended)

NSGM CLI 完全支持 Vercel 部署，包括自动化 CI/CD 流程。

**快速开始：**

1. 推送项目到 GitHub
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 导入 GitHub 仓库
4. 配置环境变量（参考 `.env.vercel.example`）
5. 点击 "Deploy"

**详细指南：** 查看 [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

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

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/erishen/nsgm.git
cd nsgm

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build CLI
pnpm run tsbuild
```

## 📖 Documentation

- [Security Guide](SECURITY.md) - Security best practices
- [Config-Based Generation Guide](docs/CONFIG-CMD-IMPLEMENTATION.md) - Batch module creation from config files
- [API Reference](docs/api.md) - Complete API documentation
- [Migration Guide](docs/migration.md) - Upgrade instructions
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## 📋 Configuration File-Based Generation

NSGM CLI supports batch module creation from JSON configuration files, making it easy to generate multiple modules at once.

### Configuration File Format

Create a JSON file (e.g., `config/modules.json`) with your module definitions:

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

### Usage Examples

```bash
# Create all modules from config
nsgm create-config config/modules.json

# Or use npm script with default config
pnpm run create-config

# Create specific module
nsgm create-config config/modules.json --module category

# Preview mode (dry-run)
nsgm create-config config/modules.json --dry-run
```

### Field Naming Convention

**Always use snake_case for field names:**

```json
{
  "name": "user_id",        // ✅ Correct
  "name": "category_id",     // ✅ Correct
  "name": "total_amount",    // ✅ Correct
  "name": "create_date",     // ✅ Correct
  "name": "update_date"      // ✅ Correct
}
```

Avoid camelCase:

```json
{
  "name": "userId",         // ❌ Not recommended
  "name": "categoryId",      // ❌ Not recommended
  "name": "totalAmount",    // ❌ Not recommended
}
```

### Configuration File Location

Generated projects include a `config/` directory with example configuration files:

```
project/
├── config/
│   ├── modules.json          # Default module configuration
└── your-custom-config.json # Your custom configurations
├── server/
├── client/
└── ...
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm run dev
```

**Database connection failed**

```bash
# Check MySQL service
sudo systemctl status mysql

# Verify credentials in .env
cat .env | grep DB_
```

**Permission denied**

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use different install location
npm config set prefix '~/.local'
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [GraphQL](https://graphql.org/) - Query language
- [Styled Components](https://styled-components.com/) - CSS-in-JS
- [MySQL](https://www.mysql.com/) - Relational database

---

<div align="center">

**Made with ❤️ by the NSGM Team**

[GitHub](https://github.com/erishen/nsgm) • [npm](https://www.npmjs.com/package/nsgm-cli) • [Issues](https://github.com/erishen/nsgm/issues)

</div>
