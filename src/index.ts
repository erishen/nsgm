#! /usr/bin/env node
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

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

const { resolve } = path
const curFolder = process.cwd()
const processArgvs = getProcessArgvs(2)
// console.log('processArgvs', processArgvs)

const { command, dictionary, controller, action } = processArgvs
// console.log('processArgvs', processArgvs)

const handleServer = (server: any, prefix: any) => {
  // 本项目路径是 NSGM-CLI/server 目录，生成项目路径是 generation/server 目录
  const serverPath = resolve(curFolder + '/server/')
  if (fs.existsSync(serverPath)) {
    const list = fs.readdirSync(serverPath)

    list.forEach((item) => {
      const resolverPath = resolve(serverPath + '/' + item)
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
          server.use('/' + filename, require(resolverPath))
          server.use(prefix + '/' + filename, require(resolverPath))
        }
      }
    })
  }
}

const handlePrefix = (prefix: string, url: string) => {
  let newUrl = ''

  if (prefix && url && url.indexOf(prefix) !== -1) {
    const urlArr = url.split(prefix)

    if (urlArr.length > 0) {
      newUrl += urlArr[0]
    }

    if (urlArr.length > 1) {
      newUrl += urlArr[1]
    }

    if (newUrl === '') newUrl = '/'
  } else {
    newUrl = url
  }

  return newUrl
}

export const startExpress = (options: any, callback: any) => {
  // console.info('startExpress', curFolder)

  const app = next(options)
  const handle = app.getRequestHandler()

  app
    .prepare()
    .then(() => {
      if (callback) {
        callback()
        return
      }

      const server = express()

      server.use(
        bodyParser.urlencoded({
          extended: false
        })
      )

      // 支持跨域，nsgm export 之后前后分离
      server.use(cors())

      server.use(bodyParser.json())

      server.use(fileUpload())

      server.use('/static', express.static(path.join(__dirname, 'public')))
      server.use('/graphql', localGraphql(command))

      const nextConfig = getConfig()
      const { publicRuntimeConfig } = nextConfig
      const { host, port, prefix } = publicRuntimeConfig

      if (prefix !== '') {
        server.use(prefix + '/static', express.static(path.join(__dirname, 'public')))
        server.use(prefix + '/graphql', localGraphql(command))
      }

      handleServer(server, prefix)

      server.get('*', (req, res) => {
        const { url } = req
        // console.log('url: ' + url)

        const parsedUrl = parse(url, true)
        return handle(req, res, parsedUrl)
      })

      server.listen(port, () => {
        console.log('> Ready on http://' + host + ':' + port)
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
    startExpress({ dev: true }, null)
    break
  case 'start':
    startExpress({ dev: false }, null)
    break
  case 'build':
    exec('next ' + command, {}, (err, stdout, stderr) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(`stdout: ${stdout}`)
      process.exit(0)
    })
    break
  case 'export':
    let shellCommand = 'next ' + command
    // console.log('dictionary', dictionary)

    if (dictionary === '') {
      shellCommand += ' -o webapp'
    } else {
      shellCommand += ' -o ' + dictionary
    }

    exec(shellCommand, {}, (err, stdout, stderr) => {
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

      _.each(fileNameArr, (item, index) => {
        if (item === 'pm2') {
          initFlag = false
          return false
        }
      })
    }

    console.log('initFlag', initFlag)
    if (initFlag) {
      initFiles(dictionary)
    }
    process.exit(0)
    break

  case '-u':
  case 'upgrade':
  case '--upgrade':
    initFiles(dictionary, true)
    process.exit(0)
    break

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
    console.log('version: ' + version)

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
    break

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
    console.log(`   dev: nsgm dev (development mode)`)
    console.log(`   build: nsgm build (production mode)`)
    console.log(`   start: nsgm start (production mode)`)
    console.log(`   export: nsgm export dictionary (default dictionary is webapp)`)
    console.log('Happy to use')
    console.log('If you have some question, please contact Erishen (787058731@qq.com). Thanks!')
    break
}
console.log()
