import type { PayloadAction } from '@reduxjs/toolkit'
import { isRejected } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { BaseOSSConfig } from '@/oss/type.ts'
import { createOSSInstance } from '@/oss/factory.ts'
import type { RootState } from '@/store'

export type HostData = {
  id: string
  /**
   * 名称.
   */
  name: string
  /**
   * ossId.
   */
  ossId: string
  /**
   * 保存的远程存储的 key.
   */
  remoteKey: string
  /**
   * 更新时间(时间戳)
   */
  updateDate: number
}
export type OssIndexRecord = Record<string, HostData[]>

export type OssState = {
  configs: BaseOSSConfig[]
  /**
   * key 为网站域名
   */
  index: OssIndexRecord
}

const initialState: OssState = {
  configs: [],
  index: {}
}

export type StorageItem = {
  name: string
  data: string
}

type SaveDataActionParam = {
  items: StorageItem[]
  config: BaseOSSConfig
  host: string
  name: string
}

function createPageDataKey(url: string, id: string): string {
  return `${url}:${id}`
}

type CreateIndexParam = HostData & { host: string }

export const savePageData = createAsyncThunk('oss/savePageData', async (data: SaveDataActionParam) => {
  const oss = createOSSInstance(data.config)
  const id = Date.now().toString(10)
  const key = createPageDataKey(data.host, id)
  await oss.insert(key, JSON.stringify(data.items))
  const r: CreateIndexParam = {
    ossId: data.config.id, remoteKey: key, host: data.host, name: data.name, updateDate: Date.now(), id
  }
  return r
})

export const deletePageData = createAsyncThunk('oss/deletePageData', async (data: { host: string, id: string }, thunkAPI) => {
  const state = thunkAPI.getState() as RootState
  const indexes = state.oss.index[data.host]
  if (!indexes) {
    throw new Error(`Host not found for ${data.host}`)
  }
  const hostDataPos = indexes.findIndex(index => index.id === data.id)
  if (hostDataPos < 0) {
    throw new Error(`Host data not found for ${data.id}`)
  }
  const hostData = indexes[hostDataPos]
  const ossConfig = (thunkAPI.getState() as RootState).oss.configs.find(v => v.id === hostData.ossId)
  if (!ossConfig) {
    throw new Error(`OSS config not found for ${hostData.ossId}`)
  }
  const oss = createOSSInstance(ossConfig)
  const remoteKey = createPageDataKey(data.host, data.id)
  await oss.delete(remoteKey)
  return {
    host: data.host,
    offset: hostDataPos
  }
})

export const ossSlice = createSlice({
  name: 'oss',
  initialState,
  reducers: {
    createNewOss(state, action: PayloadAction<BaseOSSConfig>) {
      const old = state.configs.find(v => v.id === action.payload.id)
      if (old) {
        throw new Error('Already created')
      }
      state.configs.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(savePageData.fulfilled, (state, { payload }) => {
      const idx = state.index[payload.host]
      const entity: HostData = { ...payload }
      if (!idx) {
        state.index[payload.host] = [entity]
        return
      }
      state.index[payload.host].push(entity)
    })
    builder.addCase(deletePageData.fulfilled, (state, { payload }) => {
      const idx = state.index[payload.host]
      if (!idx) {
        return
      }
      const entity = idx[payload.offset]
      if (!entity) {
        return
      }
      idx.splice(payload.offset, 1)
    })
    builder.addMatcher(isRejected, (_, action) => {
      console.error(action.error)
    })
  }
})

export const { createNewOss } = ossSlice.actions

export default ossSlice.reducer