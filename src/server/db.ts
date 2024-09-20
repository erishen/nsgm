import mysql from 'mysql2'
import fs from 'fs'
import getConfig from 'next/config'
// import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

let localMysqlFlag = true
let mysqlConfig = null
let clusterUser = ''
let clusterPassword = ''
let clusterHost = ''
let clusterPort = 0
let clusterDatabase = ''
let clusterConnectFlag = false

const getMysqlConfig = () => {
  if (mysqlConfig == null) {
    const curFolder = process.cwd()
    const curMysqlConfigPath = curFolder + '/mysql.config.js'

    if (fs.existsSync(curMysqlConfigPath)) {
      mysqlConfig = require(curMysqlConfigPath)
    } else {
      mysqlConfig = require('../../mysql.config.js')
    }
  }

  // console.log('mysqlConfig', mysqlConfig)
  return mysqlConfig
}

const mysqlConnect = ({ user, password, host, port, database }) => {
  return new Promise((resolve, reject) => {
    if (user !== '' && password !== '' && host !== '' && port !== 0 && database !== '') {
      try {
        const connection = mysql.createConnection({ user, password, host, port, database })
        connection.connect((err) => {
          if (!err) {
            resolve(connection)
          } else {
            console.log('err_mysqlConnect: ', err)
            reject()
          }
        })
      } catch (e) {
        console.log('e_mysqlConnect: ', e)
        reject()
      }
    } else {
      reject()
    }
  })
}

const reConnectDalCluster = () => {
  /*
  const nextConfig = getConfig()
  const { publicRuntimeConfig } = nextConfig
  const { env, phase } = publicRuntimeConfig


  //if (phase === PHASE_DEVELOPMENT_SERVER) {
    switch (env) {
      case 'FAT':
        clusterUser = 'us_test_erishen'
        clusterPassword = 'ddpsFcMS8DxBoeMk'
        break
      case 'UAT':
        clusterUser = 'us_test_erishen'
        clusterPassword = 'vbvRZNF0zvbFKn7W'
        break
    }
  //}
  */

  return new Promise((resolve, reject) => {
    mysqlConnect({
      user: clusterUser,
      password: clusterPassword,
      host: clusterHost,
      port: clusterPort,
      database: clusterDatabase
    })
      .then(resolve)
      .catch(reject)
  })
}

const getConnection = () => {
  mysqlConfig = getMysqlConfig()

  if (mysqlConfig != null) {
    const { mysqlOptions }: any = mysqlConfig

    return new Promise((resolve, reject) => {
      let index = 0
      if (mysqlOptions) {
        if (localMysqlFlag) {
          mysqlConnect(mysqlOptions)
            .then(resolve)
            .catch(() => {
              console.log('e_getConnection')
            })
        }
      }
    })
  }
}

export default {
  getMysqlConfig,
  getConnection
}
