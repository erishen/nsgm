import { SQLGenerator } from './sql-generator'
import { SchemaGenerator } from './schema-generator'
import { ResolverGenerator } from './resolver-generator'
import { ServiceGenerator } from './service-generator'
import { FieldDefinition } from '../cli/utils/prompt'

/**
 * 代码生成器工厂
 * 统一管理所有代码生成器
 */
export class GeneratorFactory {
  /**
   * 创建所有必要的代码生成器
   */
  static createGenerators(controller: string, action: string, fields: FieldDefinition[]) {
    return {
      sql: new SQLGenerator(controller, action, fields),
      schema: new SchemaGenerator(controller, action, fields),
      resolver: new ResolverGenerator(controller, action, fields),
      service: new ServiceGenerator(controller, action, fields)
    }
  }
}
