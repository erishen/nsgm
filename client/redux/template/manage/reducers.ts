import * as types from './types'
import _ from 'lodash'

const initialState = {
  firstLoadFlag: true,
  template: {
    totalCounts: 0,
    items: []
  }
}

export const templateManageReducer = (state = initialState, { type, payload }) => {
  const { template } = state
  const { totalCounts, items } = template
  let newItems: any = []

  switch (type) {
    case types.UPDATE_SSR_TEMPLATE:
      return {
        ...state,
        firstLoadFlag: true,
        template: payload.template
      }
    case types.GET_TEMPLATE_SUCCEEDED:
      return {
        ...state,
        firstLoadFlag: false,
        template: payload.template
      }
    case types.SEARCH_TEMPLATE_SUCCEEDED:
      return {
        ...state,
        firstLoadFlag: false,
        template: payload.template
      }
    case types.ADD_TEMPLATE_SUCCEEDED:
      newItems = [...items]
      newItems.push(payload.template)
      return {
        ...state,
        firstLoadFlag: false,
        template: {
          totalCounts: totalCounts + 1,
          items: newItems
        }
      }
    case types.MOD_TEMPLATE_SUCCEEDED:
      const modItem = payload.template

      _.each(items, (item: any) => {
        if (item.id == modItem.id) {
          newItems.push(modItem)
        } else {
          newItems.push(item)
        }
      })
      return {
        ...state,
        firstLoadFlag: false,
        template: {
          totalCounts: totalCounts,
          items: newItems
        }
      }
    case types.DEL_TEMPLATE_SUCCEEDED:
      const delItemId = payload.id

      _.each(items, (item: any) => {
        if (item.id != delItemId) {
          newItems.push(item)
        }
      })

      return {
        ...state,
        firstLoadFlag: false,
        template: {
          totalCounts: totalCounts - 1,
          items: newItems
        }
      }
    case types.BATCH_DEL_TEMPLATE_SUCCEEDED:
      const delItemIds = payload.ids
      const allIds = _.map(
        _.map(items, (item) => _.pick(item, ['id'])),
        'id'
      )
      const diffIds = _.xor(allIds, delItemIds)

      newItems = _.filter(items, (item: any) => _.includes(diffIds, item.id))

      let newTotalCounts = totalCounts - delItemIds.length
      if (newTotalCounts < 0) newTotalCounts = 0

      return {
        ...state,
        firstLoadFlag: false,
        template: {
          totalCounts: newTotalCounts,
          items: newItems
        }
      }
    default:
      return state
  }
}
