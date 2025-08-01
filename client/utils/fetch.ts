// GraphQL 客户端与 CSRF 保护工具

import axios from 'axios'
import { getLocalApiPrefix } from './common'

// 配置 axios 默认行为
axios.defaults.withCredentials = true

// ==================== GraphQL 配置 ====================

export const GRAPHQL_CONFIG = {
  // GraphQL 端点
  endpoint: '/graphql',
  
  // 默认请求头
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // 缓存配置
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5分钟
    maxSize: 100,
    enabled: true
  },
  
  // CSRF 配置
  csrf: {
    enabled: true,
    tokenHeader: 'X-CSRF-Token',
    cookieName: 'csrfToken'
  },
  
  // 开发模式配置
  development: {
    enableDebugLogs: process.env.NODE_ENV === 'development'
  }
}

// GraphQL 操作类型
export enum GraphQLOperationType {
  QUERY = 'query',
  MUTATION = 'mutation',
  SUBSCRIPTION = 'subscription'
}

// GraphQL 工具函数
export const GraphQLUtils = {
  // 检测操作类型
  getOperationType(query: string): GraphQLOperationType {
    const trimmed = query.trim().toLowerCase()
    if (trimmed.startsWith('mutation')) return GraphQLOperationType.MUTATION
    if (trimmed.startsWith('subscription')) return GraphQLOperationType.SUBSCRIPTION
    return GraphQLOperationType.QUERY
  },
  
  // 提取操作名称
  getOperationName(query: string): string | null {
    const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/)
    return match ? match[1] : null
  },
  
  // 生成缓存键
  generateCacheKey(query: string, variables?: any): string {
    const operationName = this.getOperationName(query) || 'anonymous'
    const variablesHash = variables ? JSON.stringify(variables) : ''
    return `${operationName}_${btoa(variablesHash)}`
  },
  
  // 验证 GraphQL 查询语法
  isValidQuery(query: string): boolean {
    try {
      const trimmed = query.trim()
      return (
        trimmed.length > 0 &&
        (trimmed.includes('query') || trimmed.includes('mutation') || trimmed.includes('subscription')) &&
        trimmed.includes('{') &&
        trimmed.includes('}')
      )
    } catch {
      return false
    }
  }
}

// ==================== CSRF 工具 ====================

/**
 * 获取 CSRF token
 * @returns Promise<string> CSRF token
 */
export const getCSRFToken = async (): Promise<string> => {
  try {
    const response = await axios.get(getLocalApiPrefix() + '/csrf-token', {
      withCredentials: true
    })
    
    if (!response.data || !response.data.csrfToken) {
      throw new Error('服务器返回的 CSRF token 为空')
    }
    
    return response.data.csrfToken
  } catch (error) {
    console.error('获取 CSRF token 错误:', error)
    throw error
  }
}

// ==================== GraphQL 客户端 ====================

// GraphQL 查询缓存
const queryCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = GRAPHQL_CONFIG.cache.defaultTTL

/**
 * GraphQL 客户端主函数
 * 自动处理 CSRF 保护、缓存、错误重试
 */
export const getLocalGraphql = async (query: string, variables: any = {}, useCache = false) => {
  // 验证查询语法
  if (!GraphQLUtils.isValidQuery(query)) {
    throw new Error('Invalid GraphQL query syntax')
  }
  
  // 生成缓存键
  const cacheKey = GraphQLUtils.generateCacheKey(query, variables)
  
  // 检查缓存
  if (useCache && queryCache.has(cacheKey)) {
    const cached = queryCache.get(cacheKey)!
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      if (GRAPHQL_CONFIG.development.enableDebugLogs) {
        console.log('GraphQL cache hit:', cacheKey)
      }
      return cached.data
    }
  }
  
  try {
    // 检测操作类型
    const operationType = GraphQLUtils.getOperationType(query)
    const isMutation = operationType === GraphQLOperationType.MUTATION
    
    const headers: Record<string, string> = {
      ...GRAPHQL_CONFIG.defaultHeaders
    }
    
    let response
    
    if (isMutation) {
      // Mutation 使用 POST 方法并需要 CSRF token
      if (GRAPHQL_CONFIG.csrf.enabled) {
        try {
          const csrfToken = await getCSRFToken()
          headers[GRAPHQL_CONFIG.csrf.tokenHeader] = csrfToken
        } catch (csrfError) {
          console.warn('获取 CSRF token 失败，继续执行 GraphQL 请求:', csrfError)
        }
      }
      
      response = await axios.post(
        getLocalApiPrefix() + '/graphql',
        {
          query,
          variables
        },
        {
          headers,
          withCredentials: true
        }
      )
    } else {
      // Query 和 Subscription 使用 GET 方法，不需要 CSRF token
      const params = new URLSearchParams()
      params.append('query', query)
      if (variables && Object.keys(variables).length > 0) {
        params.append('variables', JSON.stringify(variables))
      }
      
      response = await axios.get(
        getLocalApiPrefix() + '/graphql?' + params.toString(),
        {
          headers: {
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      )
    }

    if (response && response.data) {
      // 缓存查询结果
      if (useCache && !isMutation) {
        queryCache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })
      }
      
      return response.data
    } else {
      throw new Error('GraphQL response is empty')
    }
  } catch (error) {
    // 只为 mutation 检查 CSRF 错误 (403)，因为 query 使用 GET 不需要 CSRF token
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      const operationType = GraphQLUtils.getOperationType(query)
      
      if (operationType === GraphQLOperationType.MUTATION) {
        console.warn('🔄 CSRF token 可能已过期，尝试重试 mutation...')
        try {
          // 重新获取 token 并重试 mutation
          const newCsrfToken = await getCSRFToken()
          const retryHeaders = {
            ...GRAPHQL_CONFIG.defaultHeaders,
            [GRAPHQL_CONFIG.csrf.tokenHeader]: newCsrfToken
          }
          
          const retryResponse = await axios.post(
            getLocalApiPrefix() + '/graphql',
            { query, variables },
            { headers: retryHeaders, withCredentials: true }
          )
          
          return retryResponse.data
        } catch (retryError) {
          console.error('❌ CSRF mutation 重试失败:', retryError)
          throw retryError
        }
      }
    }
    
    console.error('GraphQL request failed:', error)
    throw error
  }
}

// ==================== 文件上传工具 ====================

/**
 * 创建受 CSRF 保护的文件上传配置
 */
export const createCSRFUploadProps = (
  action: string,
  options: {
    name?: string
    onSuccess?: (fileName: string) => void
    onError?: (fileName: string) => void
    beforeUpload?: (file: File) => boolean | Promise<boolean>
    accept?: string
    multiple?: boolean
  } = {}
) => {
  const {
    name = 'file',
    onSuccess,
    onError,
    beforeUpload: customBeforeUpload,
    accept,
    multiple = false
  } = options

  return {
    name,
    action,
    accept,
    multiple,
    customRequest: async (options: any) => {
      const { onProgress, onError: onUploadError, onSuccess: onUploadSuccess, file } = options

      try {
        // 获取 CSRF token
        const csrfToken = await getCSRFToken()
        if (!csrfToken) {
          throw new Error('CSRF Token 获取失败')
        }

        // 创建 FormData
        const formData = new FormData()
        formData.append(name, file)

        // 发送请求
        const uploadUrl = action.startsWith('http') ? action : getLocalApiPrefix() + action
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            [GRAPHQL_CONFIG.csrf.tokenHeader]: csrfToken
          },
          withCredentials: true
        })

        if (response.status >= 200 && response.status < 300) {
          onUploadSuccess(response)
        } else {
          throw new Error(`Upload failed: ${response.statusText}`)
        }
      } catch (error) {
        onUploadError(error)
      }
    },
    beforeUpload: async (file: File) => {
      try {
        // 验证 CSRF token
        const validation = await validateCSRFForUpload()
        if (!validation.valid) {
          throw new Error(validation.error)
        }

        // 执行自定义的 beforeUpload 检查
        if (customBeforeUpload) {
          const result = await customBeforeUpload(file)
          return result
        }

        return true
      } catch (error) {
        console.error('Upload preparation failed:', error)
        return false
      }
    },
    onChange(info: any) {
      const { status, name: fileName } = info.file

      if (status === 'done') {
        if (onSuccess) {
          onSuccess(fileName)
        }
      } else if (status === 'error') {
        if (onError) {
          onError(fileName)
        }
      }
    }
  }
}

/**
 * 验证上传前的 CSRF 状态
 */
export const validateCSRFForUpload = async (): Promise<{ valid: boolean; token?: string; error?: string }> => {
  try {
    const csrfToken = await getCSRFToken()
    if (!csrfToken) {
      return {
        valid: false,
        error: 'CSRF Token 获取失败，请刷新页面重试'
      }
    }
    return {
      valid: true,
      token: csrfToken
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '获取 CSRF Token 时发生未知错误'
    }
  }
}

// ==================== 工具函数 ====================

// 清除缓存
export const clearGraphqlCache = () => {
  queryCache.clear()
}

// GraphQL 查询辅助函数
export const graphqlQuery = async (query: string, variables?: any, useCache = true) => {
  return getLocalGraphql(query, variables, useCache)
}

// GraphQL 变更辅助函数 (Mutation)
export const graphqlMutation = async (mutation: string, variables?: any) => {
  return getLocalGraphql(mutation, variables, false) // 变更操作不使用缓存
}

// 检查 GraphQL 响应是否有错误
export const hasGraphqlErrors = (response: any): boolean => {
  return response && response.errors && response.errors.length > 0
}

// 获取 GraphQL 错误信息
export const getGraphqlErrorMessage = (response: any): string => {
  if (hasGraphqlErrors(response)) {
    return response.errors.map((error: any) => error.message).join('; ')
  }
  return ''
}
