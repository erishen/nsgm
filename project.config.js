const pkg = require('./package.json')

const { version } = pkg
const protocol = 'http'
const prefix = ''
const host = '127.0.0.1'
const port = 8080
const env = 'fat'

module.exports = {
    env,
    version,
    prefix,
    protocol,
    host,
    port
}