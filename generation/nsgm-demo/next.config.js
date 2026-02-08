const { nextConfig } = require('nsgm-cli')
const { i18n } = require('./next-i18next.config')

module.exports = (phase, defaultConfig) => {
  let configObj = nextConfig(phase, defaultConfig)

  // 确保国际化配置被正确应用
  configObj.i18n = i18n

  return configObj
}
