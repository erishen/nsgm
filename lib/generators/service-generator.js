"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceGenerator = void 0;
const base_generator_1 = require("./base-generator");
/**
 * 客户端服务生成器
 */
class ServiceGenerator extends base_generator_1.BaseGenerator {
    generate() {
        const capitalizedTypeName = this.getCapitalizedController();
        // 排除系统字段 create_date 和 update_date
        const selectFields = this.fields
            .filter((f) => !['create_date', 'update_date'].includes(f.name))
            .map((f) => f.name)
            .join(' ');
        const inputFields = this.getFormFields();
        const searchFields = this.getSearchableFields();
        const dataObject = inputFields.map((field) => `      ${field.name}`).join(',\n');
        const searchDataObject = searchFields.map((field) => `      ${field.name}`).join(',\n');
        return `import { getLocalGraphql } from '@/utils/fetch'
import _ from 'lodash'

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
${searchDataObject}
    }
  })
}

export const add${capitalizedTypeName}Service = (data: any) => {
  const { ${inputFields.map((f) => f.name).join(', ')} } = data

  const add${capitalizedTypeName}Query = \`mutation ($data: ${capitalizedTypeName}AddInput) { ${this.controller}Add(data: $data) }\`

  return getLocalGraphql(add${capitalizedTypeName}Query, {
    data: {
${dataObject}
    }
  })
}

export const update${capitalizedTypeName}Service = (id: number, data: any) => {
  const { ${inputFields.map((f) => f.name).join(', ')} } = data

  const update${capitalizedTypeName}Query = \`mutation ($id: Int, $data: ${capitalizedTypeName}AddInput) { ${this.controller}Update(id: $id, data: $data) }\`

  return getLocalGraphql(update${capitalizedTypeName}Query, {
    id,
    data: {
${dataObject}
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
  const batchAdd${capitalizedTypeName}Query = \`mutation ($datas: [${capitalizedTypeName}AddInput]) { ${this.controller}BatchAdd(datas: $datas) }\`

  return getLocalGraphql(batchAdd${capitalizedTypeName}Query, {
    datas
  })
}

export const batchDelete${capitalizedTypeName}Service = (ids: any) => {
  const batchDelete${capitalizedTypeName}Query = \`mutation ($ids: [Int]) { ${this.controller}BatchDelete(ids: $ids) }\`

  return getLocalGraphql(batchDelete${capitalizedTypeName}Query, {
    ids
  })
}
`;
    }
}
exports.ServiceGenerator = ServiceGenerator;
