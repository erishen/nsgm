import { useMemo } from "react";
import { combineReducers } from "redux";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import reducers from "./reducers";

let store: EnhancedStore | undefined;

const reducersKeysLen = Object.keys(reducers).length;

let combineReducer: any = () => ({});

if (reducersKeysLen > 0) {
  combineReducer = combineReducers({ ...reducers });
}

export type RootState = ReturnType<typeof combineReducer>;

// 创建一个临时 store 实例来获取正确的 dispatch 类型
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tempStore = configureStore({
  reducer: combineReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type AppDispatch = typeof tempStore.dispatch;

// 安全获取 NODE_ENV
const isDevToolsEnabled = () => {
  try {
    return typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
};

function initStore(initialState?: any): EnhancedStore {
  return configureStore({
    reducer: combineReducer,
    preloadedState: initialState,
    devTools: isDevToolsEnabled(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
}

export const initializeStore = (preloadedState?: any): EnhancedStore => {
  let _store = store ?? initStore(preloadedState);

  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined;
  }

  if (typeof window === "undefined") return _store;

  if (!store) store = _store;

  return _store;
};

export function useStore(initialState?: any): EnhancedStore {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
