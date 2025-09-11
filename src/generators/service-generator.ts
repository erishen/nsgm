import { BaseGenerator } from './base-generator'

/**
 * 客户端服务生成器
 */
export class ServiceGenerator extends BaseGenerator {
  generate(): string {
    const capitalizedTypeName = this.getCapitalizedController()
    // 排除系统字段 create_date 和 update_date
    const selectFields = this.fields
      .filter((f) => !['create_date', 'update_date'].includes(f.name))
      .map((f) => f.name)
      .join(' ')
    const inputFields = this.getFormFields()
    const searchFields = this.getSearchableFields()

    // 检查是否有integer类型字段需要验证
    const hasIntegerFields = inputFields.some((field) => field.type === 'integer')
    const validationFunctions = hasIntegerFields ? this.generateValidationFunctions(inputFields) : ''

    return `import { getLocalGraphql } from '@/utils/fetch'
import _ from 'lodash'

${validationFunctions}

export const get${capitalizedTypeName}Service = (page = 0, pageSize = 10) => {
  const get${capitalizedTypeName}Query = \`query ($page: Int, $pageSize: Int) { ${this.controller}(page: $page, pageSize: $pageSize) { 
        totalCounts items { 
          ${selectFields}
        } 
      } 
    }\`

  return getLocalGraphql(get${capitalizedTypeName}Query, {
    page,
    pageSize
  })
}

export const search${capitalizedTypeName}ByIdService = (id: number) => {
  const search${capitalizedTypeName}ByIdQuery = \`query ($id: Int) { ${this.controller}Get(id: $id){
      ${selectFields}
    }
  }\`

  return getLocalGraphql(search${capitalizedTypeName}ByIdQuery, {
    id
  })
}

export const search${capitalizedTypeName}Service = (page = 0, pageSize = 10, data: any) => {
  const { ${searchFields.map((f) => f.name).join(', ')} } = data

${this.generateValidationCallsForService(searchFields, '  ', false)}

  const search${capitalizedTypeName}Query = \`query ($page: Int, $pageSize: Int, $data: ${capitalizedTypeName}SearchInput) { 
    ${this.controller}Search(page: $page, pageSize: $pageSize, data: $data) {
      totalCounts items { 
        ${selectFields}
      } 
    }
  }\`

  return getLocalGraphql(search${capitalizedTypeName}Query, {
    page,
    pageSize,
    data: {
${this.generateDataObjectWithValidation(searchFields)}
    }
  })
}

export const add${capitalizedTypeName}Service = (data: any) => {
  const { ${inputFields.map((f) => f.name).join(', ')} } = data

${this.generateValidationCallsForService(inputFields, '  ', true)}

  const add${capitalizedTypeName}Query = \`mutation ($data: ${capitalizedTypeName}AddInput) { ${this.controller}Add(data: $data) }\`

  return getLocalGraphql(add${capitalizedTypeName}Query, {
    data: {
${this.generateDataObjectWithValidation(inputFields)}
    }
  })
}

export const update${capitalizedTypeName}Service = (id: number, data: any) => {
  const { ${inputFields.map((f) => f.name).join(', ')} } = data

${this.generateValidationCallsForService(inputFields, '  ', true)}

  const update${capitalizedTypeName}Query = \`mutation ($id: Int, $data: ${capitalizedTypeName}AddInput) { ${this.controller}Update(id: $id, data: $data) }\`

  return getLocalGraphql(update${capitalizedTypeName}Query, {
    id,
    data: {
${this.generateDataObjectWithValidation(inputFields)}
    }
  })
}

export const delete${capitalizedTypeName}Service = (id: number) => {
  const delete${capitalizedTypeName}Query = \`mutation ($id: Int) { ${this.controller}Delete(id: $id) }\`

  return getLocalGraphql(delete${capitalizedTypeName}Query, {
    id
  })
}

export const batchAdd${capitalizedTypeName}Service = (datas: any) => {
${this.generateBatchValidationCalls(inputFields, '  ')}

  const batchAdd${capitalizedTypeName}Query = \`mutation ($datas: [${capitalizedTypeName}AddInput]) { ${this.controller}BatchAdd(datas: $datas) }\`

  return getLocalGraphql(batchAdd${capitalizedTypeName}Query, {
    datas: validatedDatas
  })
}

export const batchDelete${capitalizedTypeName}Service = (ids: any) => {
  const batchDelete${capitalizedTypeName}Query = \`mutation ($ids: [Int]) { ${this.controller}BatchDelete(ids: $ids) }\`

  return getLocalGraphql(batchDelete${capitalizedTypeName}Query, {
    ids
  })
}
`
  }

  private generateValidationFunctions(inputFields: any[]): string {
    const integerFields = inputFields.filter((field) => field.type === 'integer')

    if (integerFields.length === 0) {
      return ''
    }

    const validationFunctions = integerFields.map((field) => {
      const fieldName = field.name
      const capitalizedName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      const upperFieldName = fieldName.toUpperCase()

      return `// 简化的${fieldName}验证函数
const validate${capitalizedName} = (${fieldName}: any, required = false) => {
  if (${fieldName} === undefined || ${fieldName} === null || ${fieldName} === '') {
    if (required) {
      return { valid: false, error: '${fieldName}是必填字段', code: 'REQUIRED_${upperFieldName}_MISSING' }
    }
    return { valid: true, value: undefined }
  }

  const parsed${capitalizedName} = parseInt(${fieldName}, 10)
  if (isNaN(parsed${capitalizedName})) {
    return {
      valid: false,
      error: \`${fieldName}必须是数字，收到的值: "\${${fieldName}}"\`,
      code: 'INVALID_${upperFieldName}_FORMAT'
    }
  }

  return { valid: true, value: parsed${capitalizedName} }
}`
    })

    return `${validationFunctions.join('\n\n')}\n\n`
  }

  private generateValidationCallsForService(inputFields: any[], indent: string, required: boolean): string {
    const integerFields = inputFields.filter((field) => field.type === 'integer')

    if (integerFields.length === 0) {
      return ''
    }

    const validationCalls = integerFields.map((field) => {
      const fieldName = field.name
      const capitalizedName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      const requiredStr = required ? 'true' : 'false'

      return `${indent}// 验证${required ? '必填' : ''}${fieldName}
${indent}const ${fieldName}Validation = validate${capitalizedName}(${fieldName}, ${requiredStr})
${indent}if (!${fieldName}Validation.valid) {
${indent}  return Promise.reject({
${indent}    error: true,
${indent}    message: ${fieldName}Validation.error,
${indent}    code: ${fieldName}Validation.code
${indent}  })
${indent}}`
    })

    return validationCalls.join('\n\n') + (validationCalls.length > 0 ? '\n\n' : '')
  }

  private generateDataObjectWithValidation(inputFields: any[]): string {
    return inputFields
      .map((field) => {
        if (field.type === 'integer') {
          return `      ${field.name}: ${field.name}Validation.value`
        }
        return `      ${field.name}`
      })
      .join(',\n')
  }

  private generateBatchValidationCalls(inputFields: any[], indent: string): string {
    const integerFields = inputFields.filter((field) => field.type === 'integer')

    if (integerFields.length === 0) {
      return `${indent}// 验证批量数据
${indent}const validatedDatas: Array<{ ${inputFields.map((f) => `${f.name}: any`).join('; ')} }> = []

${indent}for (let i = 0; i < datas.length; i++) {
${indent}  const { ${inputFields.map((f) => f.name).join(', ')} } = datas[i]

${indent}  validatedDatas.push({
${indent}    ${inputFields.map((f) => f.name).join(',\n    ')}
${indent}  })
${indent}}`
    }

    return `${indent}// 验证批量数据
${indent}const validatedDatas: Array<{ ${inputFields.map((f) => `${f.name}: ${f.type === 'integer' ? 'number' : 'any'}`).join('; ')} }> = []

${indent}for (let i = 0; i < datas.length; i++) {
${indent}  const { ${inputFields.map((f) => f.name).join(', ')} } = datas[i]

${integerFields
  .map((field) => {
    const fieldName = field.name
    const capitalizedName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)

    return `${indent}  const ${fieldName}Validation = validate${capitalizedName}(${fieldName}, true)
${indent}  if (!${fieldName}Validation.valid) {
${indent}    return Promise.reject({
${indent}      error: true,
${indent}      message: \`第 \${i + 1} 条数据: \${${fieldName}Validation.error}\`,
${indent}      code: ${fieldName}Validation.code
${indent}    })
${indent}  }`
  })
  .join('\n\n')}

${indent}  validatedDatas.push({
${indent}    ${inputFields.map((field) => (field.type === 'integer' ? `${field.name}: ${field.name}Validation.value!` : field.name)).join(',\n    ')}
${indent}  })
${indent}}`
  }
}
