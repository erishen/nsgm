import axios from 'axios'
import { getLocalApiPrefix } from './common'

// 添加缓存机制
const queryCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

export const getLocalGraphql = (query: string, variables: any = {}, useCache = false) => {
  return new Promise((resolve, reject) => {
    // 生成缓存键
    const cacheKey = `${query}:${JSON.stringify(variables)}`
    
    // 检查缓存
    if (useCache && queryCache.has(cacheKey)) {
      const cached = queryCache.get(cacheKey)!
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        resolve(cached.data)
        return
      }
    }
    
    axios
      .post(getLocalApiPrefix() + '/graphql', {
        query,
        variables
      })
      .then((res) => {
        if (res) {
          const { data } = res
          
          // 缓存结果
          if (useCache && data && !data.errors) {
            queryCache.set(cacheKey, {
              data,
              timestamp: Date.now()
            })
          }
          
          resolve(data)
        } else {
          reject(new Error('No data received'))
        }
      })
      .catch((error) => {
        console.error('GraphQL query failed:', error)
        reject(error)
      })
  })
}

// 清除缓存
export const clearGraphqlCache = () => {
  queryCache.clear()
}
