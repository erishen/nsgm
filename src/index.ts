#! /usr/bin/env node
// 加载环境变量
require('dotenv').config()

// 仅在开发环境中禁用TLS证书验证
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

import next from 'next'
import express from 'express'
import { parse } from 'url'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import { getProcessArgvs } from './args'
import localGraphql from './server/graphql'
import getConfig from 'next/config'
import { initFiles, createFiles, deleteFiles } from './generate'
import _ from 'lodash'
import cors from 'cors'
import session from 'express-session'
import { csrfProtection, getCSRFToken, securityMiddleware, createCSPMiddleware } from './server/csrf'

const { resolve } = path
const curFolder = process.cwd()
const processArgvs = getProcessArgvs(2)
// console.log('processArgvs', processArgvs)

const { command, dictionary, controller, action } = processArgvs
// console.log('processArgvs', processArgvs)

const handleServer = (server: express.Express, prefix: string) => {
  // 本项目路径是 NSGM-CLI/server 目录，生成项目路径是 generation/server 目录
  const serverPath = resolve(`${curFolder}/server/`)
  if (fs.existsSync(serverPath)) {
    const list = fs.readdirSync(serverPath)

    list.forEach((item) => {
      const resolverPath = resolve(`${serverPath}/${item}`)
      const stat = fs.statSync(resolverPath)
      const isFile = stat.isFile()

      // 只看单个文件，不看目录
      if (isFile) {
        let filename = item
        if (item.indexOf('.') !== -1) {
          filename = item.split('.')[0]
        }

        // console.log('resolverPath', resolverPath, filename)

        if (server && filename !== undefined && filename !== '') {
          try {
            const routeModule = require(resolverPath)
            // 检查导入的模块是否是有效的Express中间件
            if (
              typeof routeModule === 'function' ||
              (routeModule && typeof routeModule === 'object' && routeModule.router)
            ) {
              server.use(`/${filename}`, routeModule)
              server.use(`${prefix}/${filename}`, routeModule)
            } else {
              console.warn(`跳过文件 ${item}: 不是有效的Express路由模块`)
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error(`加载路由文件 ${item} 失败:`, errorMessage)
          }
        }
      }
    })
  }
}

export const startExpress = (options: any, callback?: () => void) => {
  // console.info('startExpress', curFolder)

  const app = next(options)
  const handle = app.getRequestHandler()

  app
    .prepare()
    .then(async () => {
      if (callback) {
        callback()
        return
      }

      // 初始化数据库连接池
      try {
        const dbPoolManager = require(resolve(`${curFolder}/server/utils/db-pool-manager`))
        await dbPoolManager.initialize()
        console.log('数据库连接池初始化完成')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error('数据库连接池初始化失败:', errorMessage)
        // 不要因为数据库连接失败就退出，允许应用继续运行
      }

      const server = express()

      // 配置 session（CSRF 保护需要）
      server.use(
        session({
          secret: process.env.SESSION_SECRET || 'nsgm-default-secret-key-change-in-production',
          resave: false,
          saveUninitialized: true, // 改为 true，确保 session 被创建
          name: 'sessionId', // 明确指定 session cookie 名称
          cookie: {
            secure: false, // 开发环境总是使用 false，生产环境再考虑 HTTPS
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24小时
            sameSite: 'lax', // 设置 SameSite 策略
            domain: undefined // 不设置 domain，使用默认
          }
        })
      )

      // 初始化 CSRF token - 移除全局初始化，让每个端点自己处理
      // server.use(setupCSRFToken)

      server.use(
        bodyParser.urlencoded({
          extended: false
        })
      )

      // 支持跨域，nsgm export 之后前后分离
      server.use(
        cors({
          credentials: true, // 允许发送 cookies
          origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
        })
      )

      server.use(bodyParser.json())

      // 添加基本安全中间件
      server.use(securityMiddleware.basicHeaders)
      if (process.env.NODE_ENV === 'production') {
        server.use(createCSPMiddleware()) // 内容安全策略
      }

      // 添加 CSRF 保护中间件（在解析 body 之后）
      server.use(csrfProtection)

      server.use(fileUpload())

      server.use('/static', express.static(path.join(__dirname, 'public')))
      server.use('/graphql', localGraphql(command))

      const nextConfig = getConfig()
      const { publicRuntimeConfig } = nextConfig
      const { host, port, prefix } = publicRuntimeConfig

      // 提供 CSRF token 的端点
      server.get('/csrf-token', getCSRFToken)
      if (prefix !== '') {
        server.get(`${prefix}/csrf-token`, getCSRFToken)
        server.use(`${prefix}/static`, express.static(path.join(__dirname, 'public')))
        server.use(`${prefix}/graphql`, localGraphql(command))
      }

      handleServer(server, prefix)

      server.get('*', (req, res) => {
        const { url } = req
        // console.log('url: ' + url)

        const parsedUrl = parse(url, true)
        return handle(req, res, parsedUrl)
      })

      server.listen(port, () => {
        console.log(`> Ready on http://${host}:${port}`)
      })
    })
    .catch((ex) => {
      console.error(ex.stack)
      process.exit(1)
    })
}

console.log()
switch (command) {
  case 'dev':
    startExpress({ dev: true }, undefined)
    break
  case 'start':
    startExpress({ dev: false }, undefined)
    break
  case 'build':
    exec('next build', {}, (err, stdout) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(`stdout: ${stdout}`)
      process.exit(0)
    })
    break
  case 'export':
    let shellCommand = `next ${command}`
    // console.log('dictionary', dictionary)

    if (dictionary === '') {
      shellCommand += ' -o webapp'
    } else {
      shellCommand += ` -o ${dictionary}`
    }

    exec(shellCommand, {}, (err, stdout) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(`stdout: ${stdout}`)
      process.exit(0)
    })

    break
  case '-i':
  case 'init':
  case '--init':
    let initFlag = true
    // console.log('process.argv', process.argv)
    const argvArr = process.argv
    const argvArrLen = argvArr.length

    let fileName = ''
    if (argvArrLen > 2) {
      fileName = argvArr[2]
    } else if (argvArrLen > 1) {
      fileName = argvArr[1]
    }

    // console.log('fileName', fileName)
    if (fileName !== '') {
      if (fileName.indexOf('\\') !== -1) {
        fileName = fileName.replace(/\\/g, '/')
        // console.log('fileName2', fileName)
      }

      const fileNameArr = fileName.split('/')
      const fileNameArrLen = fileNameArr.length
      const fileNameStr = fileNameArr[fileNameArrLen - 1]
      // console.log('fileNameStr', fileNameStr)
      if (fileNameStr === 'app') {
        initFlag = false
      }

      _.each(fileNameArr, (item) => {
        if (item === 'pm2') {
          initFlag = false
          return false
        }
        return
      })
    }

    console.log('initFlag', initFlag)
    if (initFlag) {
      initFiles(dictionary)
    }
    process.exit(0)

  case '-u':
  case 'upgrade':
  case '--upgrade':
    initFiles(dictionary, true)
    process.exit(0)

  case '-c':
  case 'create':
  case '--create':
    console.log(command, controller, action)
    if (controller !== '') {
      if (action === '') {
        createFiles(controller, 'manage')
      } else {
        createFiles(controller, action)
      }
    }
    break

  case '-d':
  case 'delete':
  case '--delete':
    console.log(command, controller, action)
    if (controller !== '') {
      if (action === '' || action === 'all') {
        deleteFiles(controller, 'all')
      } else {
        deleteFiles(controller, action)
      }
    }
    break
  case '-db':
  case 'deletedb':
  case '--deletedb':
    console.log(command, controller, action)
    if (controller !== '') {
      if (action === '' || action === 'all') {
        deleteFiles(controller, 'all', true)
      } else {
        deleteFiles(controller, action)
      }
    }
    break
  case '-v':
  case 'version':
  case '--version':
    const { version } = require('../package.json')
    console.log(`version: ${version}`)

    /*
    startExpress({ dev: true, quiet: true, dir: '.' }, () => {
      const nextConfig = getConfig()
      const { publicRuntimeConfig } = nextConfig
      const { version } = publicRuntimeConfig
      console.log('version: ' + version)
      process.exit(0)
    })
    */
    process.exit(0)

  case 'password':
  case 'generate-password':
    const passwordScript = path.resolve(__dirname, '../scripts/generate-password-hash.js')
    if (fs.existsSync(passwordScript)) {
      const password = controller || '' // 使用controller参数作为密码
      const cmd = `node ${passwordScript} ${password}`
      exec(cmd, {}, (err, stdout) => {
        if (err) {
          console.error('Error generating password hash:', err)
          return
        }
        console.log(stdout)
        process.exit(0)
      })
    } else {
      console.error('Password generation script not found!')
      process.exit(1)
    }

  case '-h':
  case 'help':
  case '--help':
  default:
    console.log('Welcome to use NSGM')
    console.log(`   -h or help: get nsgm help infomation`)
    console.log(`   -v or version: get nsgm version`)
    console.log(`   -i or init: nsgm init dictionary (default dictionary is .)`)
    console.log(`   -u or upgrade: nsgm upgrade`)
    console.log(`   -c or create: nsgm create controller action (default action is manage)`)
    console.log(`   -d or delete: nsgm delete controller action (default action is manage)`)
    console.log(`   password or generate-password: nsgm password yourpassword (generate password hash)`)
    console.log(`   dev: nsgm dev (development mode)`)
    console.log(`   build: nsgm build (production mode)`)
    console.log(`   start: nsgm start (production mode)`)
    console.log(`   export: nsgm export dictionary (default dictionary is webapp)`)
    console.log('Happy to use')
    console.log('If you have some question, please contact Erishen (787058731@qq.com). Thanks!')
    break
}
console.log()
