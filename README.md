# NSGM CLI

A full-stack development framework with code template generation capabilities, helping developers efficiently build web applications.

## Tech Stack

- [Next.js](https://github.com/vercel/next.js) - React framework
- [Styled-components](https://github.com/styled-components/styled-components) - CSS-in-JS solution
- [GraphQL](https://graphql.org/) - API query language
- [MySQL](https://www.mysql.com/) - Relational database

## Features

- Full-stack architecture design
- Automatic code template generation
- Rapid development workflow
- Integrated GraphQL API
- MySQL database support
- Secure login system with bcrypt encryption

## Command Line Tools

### Basic Commands

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `nsgm init`     | Initialize project                      |
| `nsgm upgrade`  | Upgrade project base files              |
| `nsgm create`   | Create template page                    |
| `nsgm delete`   | Delete template page                    |
| `nsgm deletedb` | Delete template page and database table |
| `nsgm dev`      | Development mode                        |
| `nsgm start`    | Production mode                         |
| `nsgm build`    | Build project                           |
| `nsgm export`   | Export static pages                     |

### Parameter Description

- **dictionary**: Used with `export`/`init` commands, default value is `webapp`

  ```
  nsgm init dictionary=webapp
  # or simplified as
  nsgm init webapp
  ```

- **controller**: Used with `create`/`delete` commands, required parameter

  ```
  nsgm create math
  ```

- **action**: Used with `create`/`delete` commands, default value is `manage`, follows the controller
  ```
  nsgm create math test
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
  console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + fullUrl)
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
    console.log('link', link)
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
