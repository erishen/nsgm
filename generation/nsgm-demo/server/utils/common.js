const { serverDB } = require('nsgm-cli')

const { getConnection, executeQuery, executePaginatedQuery } = serverDB

module.exports = {
  getConnection,        // 兼容旧版本
  executeQuery,         // 新的查询方法
  executePaginatedQuery // 新的分页查询方法
}