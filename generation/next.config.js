const { nextConfig } = require('nsgm-cli')

module.exports = (phase, defaultConfig) => {
    let configObj = nextConfig(phase, defaultConfig)

    return configObj
}