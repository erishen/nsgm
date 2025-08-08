# NSGM CLI

A full-stack development framework with code template generation capabilities, helping developers efficiently build web applications with interactive CLI wizards.

## Installation

```bash
npm install -g nsgm-cli
# or
yarn global add nsgm-cli
```

## Tech Stack

- [Next.js](https://github.com/vercel/next.js) - React framework
- [Styled-components](https://github.com/styled-components/styled-components) - CSS-in-JS solution
- [GraphQL](https://graphql.org/) - API query language
- [MySQL](https://www.mysql.com/) - Relational database

## Features

- Full-stack architecture design
- Automatic code template generation
- **Interactive CLI wizard** for beginners
- **Smart mode detection** (auto-switch between interactive/command-line)
- Rapid development workflow
- Integrated GraphQL API
- MySQL database support
- Secure login system with bcrypt encryption
- Complete CRUD operations with import/export
- Batch operations support

## Quick Start

### 1. Initialize a New Project

```bash
# Start interactive wizard (recommended)
nsgm init
# Follow the prompts to set up your project
```

### 2. Create Your First Controller

```bash
# Enter interactive controller creation
nsgm create
# The wizard will guide you through:
# - Controller name
# - Description
# - Project directory
# - Database table creation
```

### 3. Start Development

```bash
cd your-project-name
cp .env.example .env
npm run generate-password yourPassword
# Add the generated hash to .env as LOGIN_PASSWORD_HASH
npm run dev
```

Your application will be available at `http://localhost:3000` with:

- Complete CRUD interface
- Import/Export functionality
- Batch delete operations
- Secure admin login

## Command Line Tools

### Basic Commands

| Command         | Description                            | Interactive Mode |
| --------------- | -------------------------------------- | ---------------- |
| `nsgm init`     | Initialize project                     | ✅ Default       |
| `nsgm create`   | Create controller with CRUD operations | ✅ Default       |
| `nsgm delete`   | Delete controller and related files    | ✅ Default       |
| `nsgm deletedb` | Delete controller and database table   | ❌ Command only  |
| `nsgm upgrade`  | Upgrade project base files             | ❌ Command only  |
| `nsgm dev`      | Development mode                       | ❌ Command only  |
| `nsgm start`    | Production mode                        | ❌ Command only  |
| `nsgm build`    | Build project                          | ❌ Command only  |
| `nsgm export`   | Export static pages                    | ❌ Command only  |

### Interactive Mode (Recommended)

NSGM CLI features intelligent mode detection. Commands automatically switch between interactive and command-line modes based on provided parameters.

#### Project Initialization

```bash
# Interactive mode (recommended for beginners)
nsgm init

# Command-line mode (for automation)
nsgm init myproject
```

#### Controller Creation

```bash
# Interactive mode - guided wizard
nsgm create

# Command-line mode - direct creation
nsgm create user
nsgm create user manage myproject
```

#### Controller Deletion

```bash
# Interactive mode - safe guided deletion
nsgm delete

# Command-line mode - direct deletion
nsgm delete user
nsgm delete user all myproject
```

### Generated Controller Features

Each created controller includes:

- **Complete CRUD operations** (Create, Read, Update, Delete)
- **Data import/export** functionality
- **Batch delete** operations
- **Database table** with standard fields (id, name, create_date, update_date)
- **GraphQL API** integration
- **REST API** endpoints

### Command-Line Parameters (Advanced Usage)

For automation and scripting, you can bypass interactive mode by providing parameters:

- **dictionary**: Project directory name

  ```bash
  nsgm init myproject          # Creates project in 'myproject' folder
  nsgm init ../my-new-app      # Supports relative paths
  ```

- **controller**: Controller name (auto-switches to command-line mode)

  ```bash
  nsgm create user             # Creates user controller with default settings
  nsgm delete product          # Deletes product controller
  ```

- **action**: Operation type (used with controller parameter)
  ```bash
  nsgm create math manage      # Creates math controller with manage action
  nsgm delete user all         # Deletes all files related to user controller
  ```

### Legacy Commands

- **deletedb**: Delete controller and database table (command-line only)
  ```bash
  nsgm deletedb user           # Deletes user controller + database table
  ```

## Security Configuration

For security setup and login configuration, please refer to [SECURITY.md](./SECURITY.md).

### Quick Setup

1. Generate password hash:

   ```bash
   # Using npm script
   npm run generate-password yourSecurePassword
   ```

2. Create `.env` file:

   ```bash
   LOGIN_USERNAME=admin
   LOGIN_PASSWORD_HASH=your_generated_hash_here
   ```

3. Make sure `.env` is in your `.gitignore` file.

**⚠️ Important:** Never commit passwords or `.env` files to version control.

## Tips & Troubleshooting

### Using Interactive Mode

- **First time users**: Always use `nsgm init`, `nsgm create`, `nsgm delete` without parameters
- **Experienced users**: Provide parameters to skip interactive prompts
- **Path support**: Project names support relative paths like `../my-project`

### Controller Naming

- Use **camelCase** or **lowercase** for controller names (e.g., `user`, `productOrder`)
- Controller names must start with a letter
- Generated files will follow standard naming conventions

### Smart Mode Detection

- No parameters = Interactive mode
- With parameters = Command-line mode
- Mix and match based on your workflow preferences

### Common Issues

- **Permission errors**: Make sure you have write permissions in the target directory
- **Database connection**: Verify MySQL configuration in `mysql.config.js`
- **Port conflicts**: Check if port 3000 is available or configure a different port

## Project Configuration

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

## Server Directory Structure

The `server` folder in the project root contains the following:

### Directory Description

- `apis/` - Stores REST API interfaces
- `modules/` - Stores GraphQL resolvers and schemas
- `plugins/` - Stores GraphQL plugins
- `*.js` - Route files

### Example Code

#### Route File Example (server/csrf-test.js)

```javascript
const express = require('express')
const moment = require('moment')

const router = express.Router()

router.use((req, res, next) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  next()
})

router.get('/*', (req, res) => {
  res.statusCode = 200
  res.json({ name: 'TEST' })
})

module.exports = router
```

#### REST API Example (server/apis/hello.js)

```javascript
const express = require('express')
const router = express.Router()

router.get('/*', (req, res) => {
  res.statusCode = 200
  res.json({ name: 'Hello' })
})

module.exports = router
```

#### GraphQL Schema Example (server/modules/link/schema.js)

```javascript
module.exports = {
  query: `
        link: String
    `,
  mutation: `
        linkUpdate(link: Date): String
    `,
  subscription: ``,
  type: ``
}
```

#### GraphQL Resolver Example (server/modules/link/resolver.js)

```javascript
let localLink = ''

module.exports = {
  link: () => {
    return localLink
  },
  linkUpdate: ({ link }) => {
    localLink = link
    return localLink
  }
}
```

#### GraphQL Plugin Example (server/plugins/date.js)

```javascript
const moment = require('moment')
const { Kind } = require('graphql/language')
const { GraphQLScalarType } = require('graphql')

const customScalarDate = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue: (value) => moment(value).valueOf(),
  serialize: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss:SSS'),
  parseLiteral: (ast) => (ast.kind === Kind.INT ? parseInt(ast.value, 10) : null)
})

module.exports = { Date: customScalarDate }
```
