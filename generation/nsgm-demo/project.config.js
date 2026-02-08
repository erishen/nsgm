const { projectConfig } = require('nsgm-cli')
const pkg = require('./package.json')

const { env, prefix, protocol, host, port } = projectConfig
const { version } = pkg

module.exports = {
    env,
    version,
    prefix: '',
    protocol: 'http',
    host: '127.0.0.1',
    port: 8080
}