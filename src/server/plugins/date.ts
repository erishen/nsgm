import dayjs from 'dayjs'
import { Kind } from 'graphql/language'
import { GraphQLScalarType } from 'graphql'

const customScalarDate = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue: (value: any): number => {
    const date = dayjs(value)
    if (!date.isValid()) {
      throw new Error('Invalid date format')
    }
    return date.valueOf() // Ensure this returns a number
  },
  serialize: (value: any): string => {
    const date = dayjs(value)
    if (!date.isValid()) {
      throw new Error('Invalid date format')
    }
    return date.format('YYYY-MM-DD HH:mm:ss:SSS') // Ensure this returns a string
  },
  parseLiteral: (ast: any): number | null => {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10)
    } else if (ast.kind === Kind.STRING) {
      const date = dayjs(ast.value)
      if (!date.isValid()) {
        throw new Error('Invalid date format')
      }
      return date.valueOf()
    }
    return null
  },
})

export default { Date: customScalarDate }
