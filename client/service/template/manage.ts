import { getLocalGraphql } from "@/utils/fetch";
import * as _ from "lodash";

export const getTemplateService = (page = 0, pageSize = 10) => {
  const getTemplateQuery = `query ($page: Int, $pageSize: Int) { template(page: $page, pageSize: $pageSize) { 
        totalCounts items { 
          id name
        } 
      } 
    }`;

  return getLocalGraphql(getTemplateQuery, {
    page,
    pageSize,
  });
};

export const searchTemplateByIdService = (id: number) => {
  const searchTemplateByIdQuery = `query ($id: Int) { templateGet(id: $id){
      id name
    }
  }`;

  return getLocalGraphql(searchTemplateByIdQuery, {
    id,
  });
};

export const searchTemplateService = (page = 0, pageSize = 10, data: any) => {
  const { name } = data;

  const searchTemplateQuery = `query ($page: Int, $pageSize: Int, $data: TemplateSearchInput) { 
    templateSearch(page: $page, pageSize: $pageSize, data: $data) {
      totalCounts items { 
        id name
      } 
    }
  }`;

  return getLocalGraphql(searchTemplateQuery, {
    page,
    pageSize,
    data: {
      name,
    },
  });
};

export const addTemplateService = (data: any) => {
  const { name } = data;

  const addTemplateQuery = `mutation ($data: TemplateAddInput) { templateAdd(data: $data) }`;

  return getLocalGraphql(addTemplateQuery, {
    data: {
      name,
    },
  });
};

export const updateTemplateService = (id: number, data: any) => {
  const { name } = data;

  const updateTemplateQuery = `mutation ($id: Int, $data: TemplateAddInput) { templateUpdate(id: $id, data: $data) }`;

  return getLocalGraphql(updateTemplateQuery, {
    id,
    data: {
      name,
    },
  });
};

export const deleteTemplateService = (id: number) => {
  const deleteTemplateQuery = `mutation ($id: Int) { templateDelete(id: $id) }`;

  return getLocalGraphql(deleteTemplateQuery, {
    id,
  });
};

export const batchAddTemplateService = (datas: any) => {
  const batchAddTemplateQuery = `mutation ($datas: [TemplateAddInput]) { templateBatchAdd(datas: $datas) }`;

  return getLocalGraphql(batchAddTemplateQuery, {
    datas,
  });
};

export const batchDeleteTemplateService = (ids: any) => {
  const batchDeleteTemplateQuery = `mutation ($ids: [Int]) { templateBatchDelete(ids: $ids) }`;

  return getLocalGraphql(batchDeleteTemplateQuery, {
    ids,
  });
};
