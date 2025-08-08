import { FieldDefinition } from '../cli/utils/prompt'

/**
 * 基础生成器抽象类
 * 定义所有代码生成器的通用接口
 */
export abstract class BaseGenerator {
  protected controller: string
  protected action: string
  protected fields: FieldDefinition[]

  constructor(controller: string, action: string, fields: FieldDefinition[]) {
    this.controller = controller
    this.action = action
    this.fields = fields
  }

  /**
   * 生成代码的主方法
   */
  abstract generate(): string

  /**
   * 获取首字母大写的控制器名
   */
  protected getCapitalizedController(): string {
    return this.controller.charAt(0).toUpperCase() + this.controller.slice(1)
  }

  /**
   * 获取首字母大写的动作名
   */
  protected getCapitalizedAction(): string {
    return this.action.charAt(0).toUpperCase() + this.action.slice(1)
  }

  /**
   * 获取显示字段
   */
  protected getDisplayFields(): FieldDefinition[] {
    return this.fields.filter((f) => f.showInList && !f.isSystemField)
  }

  /**
   * 获取表单字段
   */
  protected getFormFields(): FieldDefinition[] {
    return this.fields.filter((f) => f.showInForm && !f.isPrimaryKey && !f.isSystemField)
  }

  /**
   * 获取可搜索字段
   */
  protected getSearchableFields(): FieldDefinition[] {
    return this.fields.filter((f) => f.searchable)
  }

  /**
   * 获取非系统字段
   */
  protected getNonSystemFields(): FieldDefinition[] {
    return this.fields.filter((f) => !f.isSystemField)
  }

  /**
   * 将字段类型转换为GraphQL类型
   */
  protected getGraphQLType(fieldType: string): string {
    switch (fieldType) {
      case 'integer':
        return 'Int'
      case 'decimal':
        return 'Float'
      case 'boolean':
        return 'Boolean'
      default:
        return 'String'
    }
  }

  /**
   * 将字段类型转换为SQL类型
   */
  protected getSQLType(field: FieldDefinition): string {
    switch (field.type) {
      case 'varchar':
        return `varchar(${field.length || 255})`
      case 'text':
        return 'text'
      case 'integer':
        return 'integer'
      case 'decimal':
        const [precision, scale] = (field.length || '10,2').toString().split(',')
        return `decimal(${precision || 10},${scale || 2})`
      case 'boolean':
        return 'boolean'
      case 'date':
        return 'date'
      case 'datetime':
        return 'datetime'
      case 'timestamp':
        return 'TIMESTAMP(3)'
      default:
        return 'varchar(255)'
    }
  }
}
