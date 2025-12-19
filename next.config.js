/**
 * Created by lei_sun on 2019/7/9.
 */
const { PHASE_DEVELOPMENT_SERVER, PHASE_EXPORT } = require('next/constants')
const fs = require('fs')
const path = require('path')
const { i18n } = require('./next-i18next.config')

module.exports = (phase, defaultConfig, options) => {
  let projectConfig = null
  let pkg = null

  const curFolder = process.cwd()
  const curProjectConfigPath = curFolder + '/project.config.js'
  const curPkgPath = curFolder + '/package.json'

  if (fs.existsSync(curProjectConfigPath)) {
    projectConfig = require(curProjectConfigPath)
  } else {
    projectConfig = require('./project.config.js')
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

  let configObj = {
    // target: 'serverless',
    // crossOrign: 'anonymous',
    i18n,
    serverRuntimeConfig: {},
    publicRuntimeConfig: {
      version,
      prefix,
      protocol,
      host,
      port,
      env,
      phase,
      isExport: phase === PHASE_EXPORT,
    },
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
      optimizeCss: true, // 启用 CSS 优化（已安装 critters 依赖）
      esmExternals: true, // 支持 ESM 外部依赖
    },
    compiler: {
      removeConsole: phase !== PHASE_DEVELOPMENT_SERVER,
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
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // 抑制服务端渲染时的 useLayoutEffect 警告
      if (dev && isServer) {
        const originalWarn = console.warn
        const originalError = console.error

        console.warn = (...args) => {
          const warnMessage = args[0]
          if (
            typeof warnMessage === 'string' &&
            (warnMessage.includes('useLayoutEffect does nothing on the server') ||
              warnMessage.includes('Warning: useLayoutEffect does nothing on the server'))
          ) {
            return
          }
          originalWarn.apply(console, args)
        }

        console.error = (...args) => {
          const errorMessage = args[0]
          if (
            typeof errorMessage === 'string' &&
            (errorMessage.includes('useLayoutEffect does nothing on the server') ||
              errorMessage.includes('Warning: useLayoutEffect does nothing on the server'))
          ) {
            return
          }
          originalError.apply(console, args)
        }
      }

      // 启用压缩
      if (!dev && !isServer) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                enforce: true,
              },
              antd: {
                test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
                name: 'antd',
                chunks: 'all',
                priority: 10,
              },
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'all',
                priority: 10,
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 5,
              },
            },
          },
          minimize: true,
        }

        // 添加分析工具
        if (process.env.ANALYZE === 'true') {
          const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
            })
          )
        }
      }

      // 优化模块解析
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'client'),
      }

      // 支持 TypeScript 路径映射
      config.resolve.modules = [path.resolve(__dirname, 'client'), 'node_modules']

      return config
    },
    generateBuildId: async () => {
      return 'nsgm-cli-' + version
    },
    exportPathMap: async function (defaultPathMap, { dev, dir, outDir }) {
      if (dev) {
        return defaultPathMap
      }

      return defaultPathMap
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
