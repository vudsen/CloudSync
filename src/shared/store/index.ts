import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import type { WebStorage } from 'redux-persist/es/types'
import type { OssState } from '@/store/oss/ossSlice'
import ossReducer from '@/store/oss/ossSlice'

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


const store = configureStore({
  reducer: {
    oss: persistReducer<OssState>({ key: 'root', storage: chromeStorage, blacklist: ['version'] }, ossReducer)
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

const persistor = persistStore(store)

export default { store, persistor }
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>