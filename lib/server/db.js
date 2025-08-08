"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const fs_1 = __importDefault(require("fs"));
const localMysqlFlag = true;
let mysqlConfig = null;
// 连接池实例
let pool = null;
const getMysqlConfig = () => {
    if (mysqlConfig == null) {
        const curFolder = process.cwd();
        const curMysqlConfigPath = `${curFolder}/mysql.config.js`;
        if (fs_1.default.existsSync(curMysqlConfigPath)) {
            mysqlConfig = require(curMysqlConfigPath);
        }
        else {
            mysqlConfig = require('../../mysql.config.js');
        }
    }
    return mysqlConfig;
};
// 创建连接池
const createPool = ({ user, password, host, port, database }) => {
    if (!pool) {
        try {
            pool = mysql2_1.default.createPool({
                host,
                port,
                user,
                password,
                database,
                connectionLimit: 20, // 最大连接数
                queueLimit: 0, // 队列限制，0为无限制
                idleTimeout: 300000, // 空闲连接超时时间（5分钟）
                maxIdle: 10, // 最大空闲连接数
                multipleStatements: false, // 禁用多语句查询以提高安全性
                bigNumberStrings: true, // 将大数字作为字符串返回
                supportBigNumbers: true, // 支持大数字
            });
            // 监听连接池事件
            pool.on('connection', (connection) => {
                console.log('数据库连接池新建连接:', connection.threadId);
            });
            pool.on('error', (error) => {
                console.error('数据库连接池错误:', error);
                if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.log('数据库连接丢失，重新创建连接池');
                    pool = null;
                    createPool({ user, password, host, port, database });
                }
            });
            console.log('数据库连接池创建成功');
        }
        catch (error) {
            console.error('创建数据库连接池失败:', error);
            throw error;
        }
    }
    return pool;
};
// 获取连接池
const getPool = () => {
    mysqlConfig = getMysqlConfig();
    if (mysqlConfig != null) {
        const { mysqlOptions } = mysqlConfig;
        if (mysqlOptions && localMysqlFlag) {
            return createPool(mysqlOptions);
        }
    }
    throw new Error('无法获取数据库配置');
};
// 执行查询（使用连接池）
const executeQuery = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        try {
            const poolInstance = getPool();
            // 使用 query 方法而不是 execute，更兼容各种SQL类型
            poolInstance.query(sql, values, (error, results) => {
                if (error) {
                    console.error('SQL执行失败:', { sql, values, error: error.message });
                    reject(new Error(`SQL执行失败: ${error.message}`));
                    return;
                }
                resolve(results);
            });
        }
        catch (error) {
            console.error('获取数据库连接失败:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            reject(new Error(`数据库连接失败: ${errorMessage}`));
        }
    });
};
// 执行带分页的查询
const executePaginatedQuery = async (sql, countSql, values, countValues = []) => {
    try {
        const [results, countResults] = await Promise.all([executeQuery(sql, values), executeQuery(countSql, countValues)]);
        return {
            totalCounts: countResults[0].counts,
            items: results,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`分页查询失败: ${errorMessage}`);
    }
};
// 关闭连接池（应用关闭时调用）
const closePool = () => {
    return new Promise((resolve, reject) => {
        if (pool) {
            pool.end((error) => {
                if (error) {
                    console.error('关闭数据库连接池失败:', error);
                    reject(error);
                }
                else {
                    console.log('数据库连接池已关闭');
                    pool = null;
                    resolve();
                }
            });
        }
        else {
            resolve();
        }
    });
};
// 兼容旧的 getConnection 方法（已废弃，建议使用新的方法）
const mysqlConnect = ({ user, password, host, port, database }) => {
    return new Promise((resolve, reject) => {
        if (user !== '' && password !== '' && host !== '' && port !== 0 && database !== '') {
            try {
                const connection = mysql2_1.default.createConnection({ user, password, host, port, database });
                connection.connect((err) => {
                    if (!err) {
                        resolve(connection);
                    }
                    else {
                        console.error('err_mysqlConnect: ', err);
                        reject();
                    }
                });
            }
            catch (e) {
                console.error('e_mysqlConnect: ', e);
                reject();
            }
        }
        else {
            reject();
        }
    });
};
// 兼容旧的 getConnection 方法（已废弃，建议使用新的方法）
const getConnection = () => {
    mysqlConfig = getMysqlConfig();
    if (mysqlConfig != null) {
        const { mysqlOptions } = mysqlConfig;
        return new Promise((resolve, reject) => {
            if (mysqlOptions) {
                if (localMysqlFlag) {
                    mysqlConnect(mysqlOptions)
                        .then(resolve)
                        .catch((err) => {
                        console.error('e_getConnection', err);
                        reject(err);
                    });
                }
                else {
                    reject(new Error('localMysqlFlag is false'));
                }
            }
            else {
                reject(new Error('mysqlOptions is missing'));
            }
        });
    }
    return Promise.reject(new Error('mysqlConfig is missing'));
};
exports.default = {
    getMysqlConfig,
    getConnection, // 兼容旧版本
    getPool, // 新的连接池方法
    executeQuery, // 新的查询方法
    executePaginatedQuery, // 新的分页查询方法
    closePool, // 关闭连接池方法
};
