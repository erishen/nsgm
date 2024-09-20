"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql2_1 = __importDefault(require("mysql2"));
var fs_1 = __importDefault(require("fs"));
// import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'
var localMysqlFlag = true;
var mysqlConfig = null;
var clusterUser = '';
var clusterPassword = '';
var clusterHost = '';
var clusterPort = 0;
var clusterDatabase = '';
var clusterConnectFlag = false;
var getMysqlConfig = function () {
    if (mysqlConfig == null) {
        var curFolder = process.cwd();
        var curMysqlConfigPath = curFolder + '/mysql.config.js';
        if (fs_1.default.existsSync(curMysqlConfigPath)) {
            mysqlConfig = require(curMysqlConfigPath);
        }
        else {
            mysqlConfig = require('../../mysql.config.js');
        }
    }
    // console.log('mysqlConfig', mysqlConfig)
    return mysqlConfig;
};
var mysqlConnect = function (_a) {
    var user = _a.user, password = _a.password, host = _a.host, port = _a.port, database = _a.database;
    return new Promise(function (resolve, reject) {
        if (user !== '' && password !== '' && host !== '' && port !== 0 && database !== '') {
            try {
                var connection_1 = mysql2_1.default.createConnection({ user: user, password: password, host: host, port: port, database: database });
                connection_1.connect(function (err) {
                    if (!err) {
                        resolve(connection_1);
                    }
                    else {
                        console.log('err_mysqlConnect: ', err);
                        reject();
                    }
                });
            }
            catch (e) {
                console.log('e_mysqlConnect: ', e);
                reject();
            }
        }
        else {
            reject();
        }
    });
};
var reConnectDalCluster = function () {
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
    return new Promise(function (resolve, reject) {
        mysqlConnect({
            user: clusterUser,
            password: clusterPassword,
            host: clusterHost,
            port: clusterPort,
            database: clusterDatabase
        })
            .then(resolve)
            .catch(reject);
    });
};
var getConnection = function () {
    mysqlConfig = getMysqlConfig();
    if (mysqlConfig != null) {
        var mysqlOptions_1 = mysqlConfig.mysqlOptions;
        return new Promise(function (resolve, reject) {
            var index = 0;
            if (mysqlOptions_1) {
                if (localMysqlFlag) {
                    mysqlConnect(mysqlOptions_1)
                        .then(resolve)
                        .catch(function () {
                        console.log('e_getConnection');
                    });
                }
            }
        });
    }
};
exports.default = {
    getMysqlConfig: getMysqlConfig,
    getConnection: getConnection
};
