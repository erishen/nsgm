const user = 'root'
const password = 'password'
const host = '127.0.0.1'
const port = 3306
const database = 'crm_demo'

module.exports = {
    mysqlOptions: {
        user,
        password,
        host,
        port,
        database
    }
}