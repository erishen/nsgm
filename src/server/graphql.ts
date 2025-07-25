import { createHandler } from 'graphql-http/lib/use/express'
import { buildSchema } from 'graphql'
import fs from 'fs'
import _ from 'lodash'
import { resolve } from 'path'
import datePlugins from './plugins/date'

// 缓存已生成的 schema 和 resolvers
let cachedSchema: string | null = null
let cachedResolvers: any = null

const defaultPath = resolve(__dirname, './modules/')
const typeDefFileName = 'schema.js'
const resolverFileName = 'resolver.js'

const curFolder = process.cwd()
const outModulesPath = resolve(`${curFolder}/server/modules/`)

const handleOutPlugins = () => {
  let result = {}
  const outPluginsPath = resolve(`${curFolder}/server/plugins/`)

  if (!fs.existsSync(outPluginsPath)) {
    return result
  }

  try {
    const list = fs.readdirSync(outPluginsPath)

    list.forEach((item) => {
      const resolverPath = resolve(`${outPluginsPath}/${item}`)

      if (!fs.existsSync(resolverPath)) return

      const stat = fs.statSync(resolverPath)
      const isFile = stat.isFile()

      if (isFile && (item.endsWith('.js') || item.endsWith('.ts'))) {
        const pluginModule = require(resolverPath)
        result = {
          ...result,
          ...(pluginModule.default || pluginModule)
        }
      }
    })
  } catch (error) {
    console.warn('⚠️  Error loading plugins:', error)
  }

  return result
}

function generateTypeDefsAndResolvers() {
  // 如果已有缓存且在生产环境，直接返回缓存
  if (process.env.NODE_ENV === 'production' && cachedSchema && cachedResolvers) {
    return {
      schemaStr: cachedSchema,
      resolvers: cachedResolvers
    }
  }

  const querySchemes = ['_: Boolean']
  const mutationSchemes = ['_: Boolean']
  const subscriptionSchemes = ['_: Boolean']
  const typeSchemes: any = []

  const resolvers = {
    ...datePlugins,
    ...handleOutPlugins()
  }

  const scalars = _.keys(resolvers)
  let scalarStr = ''
  _.each(scalars, (item) => {
    scalarStr += `scalar ${item}\n    `
  })

  // console.log('resolvers', resolvers, _.keys(resolvers), scalarStr)

  const _generateAllComponentRecursive = (path = defaultPath) => {
    if (!fs.existsSync(path)) return

    try {
      const list = fs.readdirSync(path)

      list.forEach((item) => {
        const resolverPath = `${path}/${item}`

        if (!fs.existsSync(resolverPath)) return

        const stat = fs.statSync(resolverPath)
        const isDir = stat.isDirectory()
        const isFile = stat.isFile()

        if (isDir) {
          _generateAllComponentRecursive(resolverPath)
        } else if (isFile && item === typeDefFileName) {
          try {
            let schemaObj = require(resolverPath)
            if (schemaObj.default !== undefined) schemaObj = schemaObj.default

            const { query, mutation, subscription, type } = schemaObj

            if (query && query !== '') querySchemes.push(query)
            if (mutation && mutation !== '') mutationSchemes.push(mutation)
            if (subscription && subscription !== '') subscriptionSchemes.push(subscription)
            if (type && type !== '') typeSchemes.push(type)
          } catch (error) {
            console.warn(`⚠️  Error loading schema from ${resolverPath}:`, error)
          }
        } else if (isFile && item === resolverFileName) {
          try {
            let resolversObj = require(resolverPath)
            if (resolversObj.default !== undefined) resolversObj = resolversObj.default

            Object.keys(resolversObj).forEach((k) => {
              if (!resolvers[k]) resolvers[k] = {}
              resolvers[k] = resolversObj[k]
            })
          } catch (error) {
            console.warn(`⚠️  Error loading resolver from ${resolverPath}:`, error)
          }
        }
      })
    } catch (error) {
      console.warn(`⚠️  Error reading directory ${path}:`, error)
    }
  }

  _generateAllComponentRecursive()
  _generateAllComponentRecursive(outModulesPath)

  const schemaStr = `
    ${scalarStr}

    type Query { 
        ${querySchemes.join('\n')} 
    }

    type Mutation { 
        ${mutationSchemes.join('\n')} 
    }

    type Subscription { 
        ${subscriptionSchemes.join('\n')} 
    }

    ${typeSchemes.join('\n')}
  `

  // 在生产环境中缓存结果
  if (process.env.NODE_ENV === 'production') {
    cachedSchema = schemaStr
    cachedResolvers = resolvers
  }

  return { querySchemes, mutationSchemes, subscriptionSchemes, typeSchemes, resolvers, scalarStr, schemaStr }
}

const generateResult = generateTypeDefsAndResolvers()

const {
  querySchemes: querySchemesV,
  mutationSchemes: mutationSchemesV,
  subscriptionSchemes: subscriptionSchemesV,
  typeSchemes: typeSchemesV,
  resolvers: resolversV,
  scalarStr: scalarStrV,
  schemaStr: generatedSchemaStr
} = generateResult

// 导出 handler 函数，兼容 express 用法
const handler = (command: string) => {
  const schemaStr =
    generatedSchemaStr ||
    `
      ${scalarStrV}

      type Query { 
          ${querySchemesV?.join('\n') || '_: Boolean'} 
      }

      type Mutation { 
          ${mutationSchemesV?.join('\n') || '_: Boolean'} 
      }

      type Subscription { 
          ${subscriptionSchemesV?.join('\n') || '_: Boolean'} 
      }

      ${typeSchemesV?.join('\n') || ''}
    `

  if (command === 'dev') {
    console.log('schemaStr', schemaStr)
    console.log('resolvers', resolversV)
  }

  // graphql-http 不再内置 graphiql，需手动集成 playground 或 altair，以下为基础 handler
  return createHandler({
    schema: buildSchema(schemaStr),
    rootValue: resolversV
  })
}

export default handler
