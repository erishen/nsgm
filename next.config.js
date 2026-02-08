/**
 * Created by lei_sun on 2019/7/9.
 */
const { PHASE_DEVELOPMENT_SERVER, PHASE_EXPORT } = require('next/constants')
const fs = require('fs')
const path = require('path')

// 直接定义 i18n 配置，避免在 Vercel 上找不到配置文件
const i18n = {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en-US', 'ja-JP'],
  localeDetection: false,
}

module.exports = (phase, defaultConfig, options) => {
  let projectConfig = null
  let pkg = null

  const curFolder = process.cwd()
  const curProjectConfigPath = curFolder + '/project.config.js'
  const curPkgPath = curFolder + '/package.json'

  if (fs.existsSync(curProjectConfigPath)) {
    projectConfig = require(curProjectConfigPath)
  } else if (fs.existsSync('./project.config.js')) {
    projectConfig = require('./project.config.js')
  } else {
    // 默认配置（用于 Vercel 等环境）
    projectConfig = {
      env: 'production',
      version: '1.0.0',
      prefix: '',
      protocol: 'https',
      host: 'localhost',
      port: '443'
    }
  }

  if (fs.existsSync(curPkgPath)) {
    pkg = require(curPkgPath)
  } else {
    pkg = require('./package.json')
  }

  let { env, version, prefix, protocol, host, port } = projectConfig

  if (options != undefined) {
    version = options.version
    prefix = options.prefix
    protocol = options.protocol
    host = options.host
    port = options.port
  }

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    prefix = ''
  }

  // 设置环境变量用于客户端访问
  process.env.NEXT_PUBLIC_VERSION = version
  process.env.NEXT_PUBLIC_PREFIX = prefix
  process.env.NEXT_PUBLIC_PROTOCOL = protocol
  process.env.NEXT_PUBLIC_HOST = host
  process.env.NEXT_PUBLIC_PORT = port
  process.env.NEXT_PUBLIC_ENV = env
  process.env.NEXT_PUBLIC_IS_EXPORT = phase === PHASE_EXPORT ? 'true' : 'false'

  let configObj = {
    // target: 'serverless',
    // crossOrign: 'anonymous',
    i18n,
    transpilePackages: [
      'antd',
      '@ant-design',
      'rc-util',
      'rc-pagination',
      'rc-picker',
      'rc-notification',
      'rc-tooltip',
      'rc-tree',
      'rc-table',
    ],
    // Bundle 优化配置
    experimental: {
      // optimizeCss: true, // 启用 CSS 优化（需要 critters 依赖，已禁用以避免兼容性问题）
      esmExternals: true, // 支持 ESM 外部依赖
    },
    compiler: {
      removeConsole: phase !== PHASE_DEVELOPMENT_SERVER ? { exclude: ['warn', 'error'] } : false,
      styledComponents: true,
    },
    ...(phase === PHASE_DEVELOPMENT_SERVER && {
      devIndicators: {
        position: 'bottom-right',
      },
    }),
    allowedDevOrigins: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      '127.0.0.1:8080',
      'localhost:8080',
      '127.0.0.1',
      'localhost',
    ],
    // 使用 Turbopack（Next.js 16 默认）
    turbopack: {},
    generateBuildId: async () => {
      return 'nsgm-cli-' + version
    },
    generateEtags: false,
    useFileSystemPublicRoutes: true,
  }

  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    // 在 Vercel 环境中使用默认的 .next 目录，否则使用 build 目录
    const distDir = process.env.VERCEL ? '.next' : 'build'
    
    configObj = {
      ...configObj,
      distDir,
      assetPrefix: prefix,
      async rewrites() {
        return [
          {
            source: prefix === '' ? '/' : prefix,
            destination: '/',
          },
          {
            source: prefix + '/:slug*',
            destination: '/:slug*',
          },
        ]
      },
    }
  }

  return configObj
}
