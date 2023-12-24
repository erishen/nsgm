import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import fs from 'fs'
import _ from 'lodash'
import { resolve } from 'path'
import datePlugins from './plugins/date'

const defaultPath = resolve(__dirname, './modules/')
const typeDefFileName = 'schema.js'
const resolverFileName = 'resolver.js'

const curFolder = process.cwd()
const outModulesPath = resolve(curFolder + '/server/modules/')

const handleOutPlugins = () => {
  let result = {}
  const outPluginsPath = resolve(curFolder + '/server/plugins/')
  if (fs.existsSync(outPluginsPath)) {
    const list = fs.readdirSync(outPluginsPath)

    list.forEach((item) => {
      const resolverPath = resolve(outPluginsPath + '/' + item)
      const stat = fs.statSync(resolverPath)
      const isFile = stat.isFile()

      if (isFile) {
        result = {
          ...require(resolverPath)
        }
      }
    })
  }

  return result
}

function generateTypeDefsAndResolvers() {
  const querySchemes = [
    `
        _: Boolean
    `
  ]
  const mutationSchemes = [
    `
        _: Boolean
    `
  ]
  const subscriptionSchemes = [
    `
        _: Boolean
    `
  ]
  const typeSchemes: any = []
  const resolvers = {
    ...datePlugins,
    ...handleOutPlugins()
  }

  const scalars = _.keys(resolvers)
  let scalarStr = ''
  _.each(scalars, (item, index) => {
    scalarStr += 'scalar ' + item + '\n    '
  })

  // console.log('resolvers', resolvers, _.keys(resolvers), scalarStr)

  const _generateAllComponentRecursive = (path = defaultPath) => {
    if (fs.existsSync(path)) {
      const list = fs.readdirSync(path)

      list.forEach((item) => {
        const resolverPath = path + '/' + item
        const stat = fs.statSync(resolverPath)
        const isDir = stat.isDirectory()
        const isFile = stat.isFile()

        if (isDir) {
          _generateAllComponentRecursive(resolverPath)
        } else if (isFile && item === typeDefFileName) {
          // console.log('resolverPath1', resolverPath)
          let schemaObj = require(resolverPath)

          if (schemaObj.default !== undefined) schemaObj = schemaObj.default

          const { query, mutation, subscription, type } = schemaObj

          if (query !== '') querySchemes.push(query)

          if (mutation !== '') mutationSchemes.push(mutation)

          if (subscription !== '') subscriptionSchemes.push(subscription)

          if (type !== '') typeSchemes.push(type)
        } else if (isFile && item === resolverFileName) {
          // console.log('resolverPath2', resolverPath)
          let resolversObj = require(resolverPath)

          if (resolversObj.default !== undefined) resolversObj = resolversObj.default

          Object.keys(resolversObj).forEach((k) => {
            if (!resolvers[k]) resolvers[k] = {}
            resolvers[k] = resolversObj[k]
          })
        }
      })
    }
  }

  _generateAllComponentRecursive()
  _generateAllComponentRecursive(outModulesPath)

  return { querySchemes, mutationSchemes, subscriptionSchemes, typeSchemes, resolvers, scalarStr }
}

const {
  querySchemes: querySchemesV,
  mutationSchemes: mutationSchemesV,
  subscriptionSchemes: subscriptionSchemesV,
  typeSchemes: typeSchemesV,
  resolvers: resolversV,
  scalarStr: scalarStrV
} = generateTypeDefsAndResolvers()

const schemaStr = `
    ${scalarStrV}

    type Query { 
        ${querySchemesV.join('\n')} 
    }

    type Mutation { 
        ${mutationSchemesV.join('\n')} 
    }

    type Subscription { 
        ${subscriptionSchemesV.join('\n')} 
    }

    ${typeSchemesV.join('\n')}
`

export default (command: string) => {
  if (command === 'dev') {
    console.log('schemaStr', schemaStr)
    console.log('resolvers', resolversV)
  }

  return graphqlHTTP({
    schema: buildSchema(schemaStr),
    rootValue: resolversV,
    graphiql: true
  })
}
