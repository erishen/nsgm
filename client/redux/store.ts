import { useMemo } from 'react'
import { combineReducers } from 'redux'
import { configureStore, Tuple } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import reducers from './reducers'
import _ from 'lodash'

let store: any

const reducersKeysLen = _.keys(reducers).length

let combineReducer: any = function () { }

if (reducersKeysLen > 0) {
  combineReducer = combineReducers({ ...reducers })
}

export type RootState = ReturnType<typeof combineReducer>

function initStore(initialState: any) {
  return configureStore({
    reducer: combineReducer,
    preloadedState: initialState,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thunk),
  })
}

export const initializeStore = (preloadedState: any) => {
  let _store = store ?? initStore(preloadedState)

  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState
    })
    store = undefined
  }

  if (typeof window === 'undefined') return _store

  if (!store) store = _store

  return _store
}

export function useStore(initialState: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
