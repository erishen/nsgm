const { mysqlConfig } = require('nsgm-cli')
const { mysqlOptions } = mysqlConfig
const { user, password, host, port, database } = mysqlOptions

module.exports = {
    mysqlOptions: {
        user: 'root',
        password: 'password',
        host: '127.0.0.1',
        port: 3306,
        database: 'crm_demo'
    }
}