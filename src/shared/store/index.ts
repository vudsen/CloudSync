import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import type { PersistConfig, WebStorage } from 'redux-persist/es/types'
import type { StatisticsState } from '@/store/statistics/statisticsSlice'
import statisticsReducer from '@/store/statistics/statisticsSlice'

const chromeStorage: WebStorage = {
  async getItem(key: string): Promise<string | null> {
    const r = await chrome.storage.sync.get(key)
    const value = r[key]
    return typeof value === 'string' ? value : null
  },
  setItem(key: string, item: string): Promise<void> {
    return chrome.storage.sync.set({
      [key]: item
    })
  },
  removeItem(key: string): Promise<void> {
    return chrome.storage.sync.remove(key)
  }
}

const persistConfig: PersistConfig<StatisticsState> = {
  key: 'root',
  storage: chromeStorage
}

const store = configureStore({
  reducer: {
    statistics: persistReducer(persistConfig, statisticsReducer),
  }
})

const persistor = persistStore(store)

export default { store, persistor }
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch