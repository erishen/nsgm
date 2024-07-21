/**
 * Created by lei_sun on 2019/7/9.
 */
const { PHASE_DEVELOPMENT_SERVER, PHASE_EXPORT } = require('next/constants')
const fs = require('fs')

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
