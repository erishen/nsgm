/**
 * Created by lei_sun on 2019/7/9.
 */
const { PHASE_DEVELOPMENT_SERVER, PHASE_EXPORT } = require('next/constants')
const fs = require('fs')
const path = require('path')

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

  // const env = (pkg && pkg.config && pkg.config.env && pkg.config.env.toUpperCase()) || 'PROD'

  // console.log('projectConfig', projectConfig)
  let { env, version, prefix, protocol, host, port } = projectConfig

  // console.log('options', options)
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

  // console.log('phase', phase, version, prefix, protocol, host, port)

  let configObj = {
    // target: 'serverless',
    // crossOrign: 'anonymous',
    serverRuntimeConfig: {},
    publicRuntimeConfig: {
      version,
      prefix,
      protocol,
      host,
      port,
      env,
      phase,
      isExport: (phase === PHASE_EXPORT)
    },
    transpilePackages: ["antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table"],
    // Bundle 优化配置
    experimental: {
      optimizeCss: true, // 启用 CSS 优化（已安装 critters 依赖）
      swcMinify: true,   // 使用 SWC 压缩器
      esmExternals: true // 支持 ESM 外部依赖
    },
    compiler: {
      removeConsole: phase !== PHASE_DEVELOPMENT_SERVER,
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
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
    configObj = {
      ...configObj,
      distDir: 'build',
      assetPrefix: prefix,
      async rewrites() {
        return [
          {
            source: prefix === '' ? '/' : prefix,
            destination: '/'
          },
          {
            source: prefix + '/:slug*',
            destination: '/:slug*'
          }
        ]
      }
    }
  }

  return configObj
}
