import { useMemo } from 'react'
import { combineReducers } from 'redux'
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit'
import reducers from './reducers'

let store: EnhancedStore | undefined

const reducersKeysLen = Object.keys(reducers).length

let combineReducer: any = () => ({})

if (reducersKeysLen > 0) {
  combineReducer = combineReducers({ ...reducers })
}

export type RootState = ReturnType<typeof combineReducer>

function initStore(initialState?: any): EnhancedStore {
  return configureStore({
    reducer: combineReducer,
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  })
}

export const initializeStore = (preloadedState?: any): EnhancedStore => {
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

export function useStore(initialState?: any): EnhancedStore {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
