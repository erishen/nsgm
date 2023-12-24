const nextConfig = require('./next.config')
const projectConfig = require('./project.config')
const mysqlConfig = require('./mysql.config')
const serverDB = require('./lib/server/db').default

module.exports = {
    nextConfig,
    projectConfig,
    mysqlConfig,
    serverDB
}