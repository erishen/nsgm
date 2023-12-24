/**
 * Created by lei_sun on 2019/7/9.
 */
const { PHASE_DEVELOPMENT_SERVER, PHASE_EXPORT } = require('next/constants')
const fs = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const copyFile = promisify(fs.copyFile)
const SimpleProgressPlugin = require('webpack-simple-progress-plugin')
const TerserPlugin = require('terser-webpack-plugin')

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
    //target: 'serverless',
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
    webpack: (config, { dev, isServer }) => {
      //console.log('dev', dev, isServer)

      if (!dev) {
        if (!isServer) {
          config.optimization.splitChunks = {
            cacheGroups: {
              default: false,
              vendors: false,
              framework: {
                //将react和react-dom打入framework当中
                name: 'framework',
                chunks: 'all',
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, //匹配库当中的react和react-dom
                priority: 40 //权重为40 最大权重
              },
              lib: {
                test(module) {
                  //匹配包大于160000的
                  return module.size() > 160000
                },
                name(module) {
                  //名字就是包当中的名字
                  return (
                    /[\\/]node_modules[\\/](.*)/.exec(module.identifier()) &&
                    /[\\/]node_modules[\\/](.*)/.exec(module.identifier()).length &&
                    /[\\/]node_modules[\\/](.*)/.exec(module.identifier())[1].replace(/\/|\\/g, '_')
                  )
                },
                priority: 30, //权重为30
                minChunks: 1, //最小共用次数为1时就使用
                reuseExistingChunk: true
              },
              commons: {
                name: 'commons',
                chunks: 'all',
                minChunks: 20,
                maxSize: 30720,
                priority: 20
              },
              shared: {
                priority: 10,
                minChunks: 2,
                reuseExistingChunk: true
              },
              styles: {
                name: 'styles',
                test: /\.css$/,
                chunks: 'all',
                maxSize: 30720,
                enforce: true,
              },
              less: {
                name: 'less',
                test: /\.less$/,
                chunks: 'all',
                maxSize: 30720,
                enforce: true,
              },
            }
          }
          config.output.chunkFilename = `static/chunks/[name].${version}.js`

          config.output.filename = ({ chunk }) => {
            const { name } = chunk
            //console.log('name', name)

            if (name === 'main') {
              return `static/main.${version}.js`
            } else if (name === 'polyfills') {
              return `static/polyfills.${version}.js`
            } else if (name.indexOf('webpack') != -1) {
              return `[name]`
            }

            return `static/[name].${version}.js`
          }

          config.optimization.runtimeChunk = {
            name: `static/runtime/webpack.${version}.js`
          }
        }

        config.plugins.map((plugin) => {
          //console.log('plugin.constructor.name', plugin.constructor.name)
          if ('NextMiniCssExtractPlugin' == plugin.constructor.name) {
            plugin.options = {
              filename: `static/css/[name].${version}.css`,
              chunkFilename: `static/css/[name].${version}.css`,
              moduleFilename: ({ name }) => {
                //console.log('name', name)
                return `static/css/${name}.${version}.css`
              }
            }
          }
        })

        config.plugins.push(new SimpleProgressPlugin())

        config.optimization.minimizer = [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              ecma: 6
            },
            minify: (file, sourceMap) => {
              // https://github.com/mishoo/UglifyJS2#minify-options
              const uglifyJsOptions = {
                /* your `uglify-js` package options */
                compress: {
                  // warnings: true,
                  drop_console: true,
                  drop_debugger: true
                }
              }

              if (sourceMap) {
                uglifyJsOptions.sourceMap = {
                  content: sourceMap
                }
              }

              return require('uglify-js').minify(file, uglifyJsOptions)
            }
          })
        ]
      }

      return config
    }
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
