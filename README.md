# NSGM CLI
- 技术栈: [Next](https://github.com/vercel/next.js), [Styled-components](https://github.com/styled-components/styled-components), [Graphql](https://graphql.org/), [Mysql](https://www.mysql.com/)
- 全栈架构，代码模板生成，快速开发
- 数据库采用 Mysql, 配置见 mysql.config.js
- 项目配置见 project.config.js
- Next 框架配置见 next.config.js
- [ERISHEN](https://www.erishen.cn/)
- [Demo](https://nsgm.erishen.cn:8443/)
  
## 命令
- nsgm init    初始化项目
- nsgm upgrade 升级项目基础文件
- nsgm create  创建模板页面
- nsgm delete  删除模板页面
- nsgm deletedb 删除模板页面及数据库表
- nsgm dev     开发模式
- nsgm start   生产模式
- nsgm build   编译
- nsgm export  导出静态页面
        
## 参数
- dictionary: 在 export/init 的时候使用, 默认 webapp, 譬如: nsgm init|export dictionary=webapp 或者 nsgm init|export webapp
- controller: 在 create/delete 的时候使用， 必须有。譬如：nsgm create|delete math
- action:     在 create/delete 的时候使用， 默认 manage, 跟在 controller 后面， 譬如 nsgm create|delete math test

## 根目录新增 next.config.js
```
const { nextConfig } = require('nsgm-cli')
const projectConfig = require('./project.config')

const { version, prefix, protocol, host } = projectConfig 

module.exports = (phase, defaultConfig) => {
    let configObj = nextConfig(phase, defaultConfig, { 
        version, prefix, protocol, host
    })

    return configObj
}
```

## 根目录新增 mysql.config.js
```
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

## 根目录新增 project.config.js
```
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

## 根目录新增 server 
- apis    存放 Rest Api 
- modules 存放 graphql 的 resolver 和 schema
- plugins 存放 graphql 的 plugin
- *.js  举例： test.js =>  用于响应 /test/*, ${prefix}/test/* 请求

```
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

- apis/hello.js
```
const express = require('express')
const router = express.Router()

router.get('/*', (req, res) => {
    res.statusCode = 200
    res.json({ name: 'Hello' })
})

module.exports = router
```

- modules/link/schema.js
```
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

- modules/link/resolver.js
```
let localLink = ''

module.exports = {
    link: () => {
        return localLink
    },
    linkUpdate: ({ link }) =>{
        console.log('link', link)
        localLink = link
        return localLink
    }
}
```

- plugins/date.js
```
const moment = require('moment')
const { Kind } = require('graphql/language')
const { GraphQLScalarType } = require('graphql')

const customScalarDate = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue: value => moment(value).valueOf(),
    serialize: value => moment(value).format('YYYY-MM-DD HH:mm:ss:SSS'),
    parseLiteral: ast => (ast.kind === Kind.INT)
        ? parseInt(ast.value, 10)
        : null
})

module.exports = { Date: customScalarDate }
```

