import * as types from './types'
import { getTemplateService, addTemplateService, updateTemplateService, deleteTemplateService, searchTemplateService, batchDeleteTemplateService } from '@/service/template/manage'
import { AppDispatch } from '@/redux/store'

export const getTemplate = (page=0, pageSize=10) => (
  dispatch: AppDispatch
) => {
  dispatch({
    type: types.GET_TEMPLATE
  })

  getTemplateService(page, pageSize)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      dispatch({
        type: types.GET_TEMPLATE_SUCCEEDED,
        payload: {
          template: data.template
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.GET_TEMPLATE_FAILED
      })
    })
}

export const searchTemplate = (page=0, pageSize=10, data: any) => (
  dispatch: AppDispatch
) => {
  dispatch({
    type: types.SEARCH_TEMPLATE
  })

  searchTemplateService(page, pageSize, data)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      dispatch({
        type: types.SEARCH_TEMPLATE_SUCCEEDED,
        payload: {
          template: data.templateSearch
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.SEARCH_TEMPLATE_FAILED
      })
    })
}

export const updateSSRTemplate = (template: any) => (
  dispatch: AppDispatch
) => {
  dispatch({
    type: types.UPDATE_SSR_TEMPLATE,
    payload: {
      template: template
    }
  })
}

export const addTemplate = (obj:any) => (
  dispatch: AppDispatch
) => {
  dispatch({
    type: types.ADD_TEMPLATE
  })

  addTemplateService(obj)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      const template = {
        id: data.templateAdd,
        ...obj
      }
      dispatch({
        type: types.ADD_TEMPLATE_SUCCEEDED,
        payload: {
          template
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.ADD_TEMPLATE_FAILED
      })
    })
}

export const modTemplate = (id: number, obj: any) => (
  dispatch: AppDispatch
) => {
  dispatch({
    type: types.MOD_TEMPLATE
  })

  updateTemplateService(id, obj)
    .then((res: any) => {
      console.log('action_res', res)
      const template = {
        id,
        ...obj
      }
      dispatch({
        type: types.MOD_TEMPLATE_SUCCEEDED,
        payload: {
          template
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.MOD_TEMPLATE_FAILED
      })
    })
}

export const delTemplate = (id: number) => (
  dispatch: AppDispatch
) => {
  dispatch({
    type: types.DEL_TEMPLATE
  })

  deleteTemplateService(id)
    .then((res: any) => {
      console.log('action_res', res)

      dispatch({
        type: types.DEL_TEMPLATE_SUCCEEDED,
        payload: {
          id
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.DEL_TEMPLATE_FAILED
      })
    })
}

export const batchDelTemplate = (ids:any) => (
  dispatch: AppDispatch
) => {
  dispatch({
    type: types.BATCH_DEL_TEMPLATE
  })

  batchDeleteTemplateService(ids)
    .then((res: any) => {
      console.log('action_res', res)

      dispatch({
        type: types.BATCH_DEL_TEMPLATE_SUCCEEDED,
        payload: {
          ids
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.BATCH_DEL_TEMPLATE_FAILED
      })
    })
}