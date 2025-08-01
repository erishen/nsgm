import { getLocalGraphql } from '@/utils/fetch'
import _ from 'lodash'

export const getTemplateService = (page = 0, pageSize = 10) => {
  const getTemplateQuery = `query ($page: Int, $pageSize: Int) { template(page: $page, pageSize: $pageSize) { 
        totalCounts items { 
          id name
        } 
      } 
    }`

  return getLocalGraphql(getTemplateQuery, {
    page,
    pageSize
  }, true) // 启用缓存，因为这是查询操作
}

export const searchTemplateByIdService = (id: number) => {

  const searchTemplateByIdQuery = `query ($id: Int) { templateGet(id: $id){
      id name
    }
  }`

  return getLocalGraphql(searchTemplateByIdQuery, {
    id
  }, true) // 启用缓存，因为这是查询操作
}

export const searchTemplateService = (page = 0, pageSize = 10, data: any) => {
  const { name } = data

  const searchTemplateQuery = `query ($page: Int, $pageSize: Int, $data: TemplateSearchInput) { 
    templateSearch(page: $page, pageSize: $pageSize, data: $data) {
      totalCounts items { 
        id name
      } 
    }
  }`

  return getLocalGraphql(searchTemplateQuery, {
    page,
    pageSize,
    data: {
      name
    }
  }, true) // 启用缓存，因为这是查询操作
}

export const addTemplateService = (data: any) => {
  const { name } = data

  const addTemplateQuery = `mutation ($data: TemplateAddInput) { templateAdd(data: $data) }`

  return getLocalGraphql(addTemplateQuery, {
    data: {
      name
    }
  }, false) // 不使用缓存，因为这是变更操作，会自动添加 CSRF token
}

export const updateTemplateService = (id: number, data: any) => {
  const { name } = data

  const updateTemplateQuery = `mutation ($id: Int, $data: TemplateAddInput) { templateUpdate(id: $id, data: $data) }`

  return getLocalGraphql(updateTemplateQuery, {
    id,
    data: {
      name
    }
  }, false) // 不使用缓存，因为这是变更操作，会自动添加 CSRF token
}

export const deleteTemplateService = (id: number) => {
  const deleteTemplateQuery = `mutation ($id: Int) { templateDelete(id: $id) }`

  return getLocalGraphql(deleteTemplateQuery, {
    id
  }, false) // 不使用缓存，因为这是变更操作，会自动添加 CSRF token
}

export const batchAddTemplateService = (datas: any) => {
  const batchAddTemplateQuery = `mutation ($datas: [TemplateAddInput]) { templateBatchAdd(datas: $datas) }`

  return getLocalGraphql(batchAddTemplateQuery, {
    datas
  }, false) // 不使用缓存，因为这是变更操作，会自动添加 CSRF token
}

export const batchDeleteTemplateService = (ids: any) => {
  const batchDeleteTemplateQuery = `mutation ($ids: [Int]) { templateBatchDelete(ids: $ids) }`

  return getLocalGraphql(batchDeleteTemplateQuery, {
    ids
  }, false) // 不使用缓存，因为这是变更操作，会自动添加 CSRF token
}