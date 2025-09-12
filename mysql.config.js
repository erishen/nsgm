const user = 'root'
const password = 'password'
const host = process.env.MYSQL_HOST || 'mysql'
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