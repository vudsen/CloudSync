import type { PayloadAction } from '@reduxjs/toolkit'
import { isRejected } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { BaseOSSConfig } from '@/oss/type.ts'
import { createOSSInstance } from '@/oss/factory.ts'
import type { AppThunk, RootState } from '@/store'

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
export type OssIndexRecord = Record<string, HostData[] | undefined>

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

export const createNewOss = (data: BaseOSSConfig): AppThunk => {
  return (dispatch, getState) => {
    const state = getState() as RootState
    const old = state.oss.configs.find(v => v.id === data.id)
    if (old) {
      throw new Error('Already existed.')
    }
    dispatch(ossSlice.actions.addOssConfig(data))
  }
}

export const updateOssConfig = (data: BaseOSSConfig): AppThunk => {
  return (dispatch, getState) => {
    const state = getState() as RootState
    const old = state.oss.configs.find(v => v.id === data.id)
    if (!old) {
      throw new Error('Oss not exist.')
    }
    dispatch(ossSlice.actions.updateOssConfig(data))
  }
}



export const ossSlice = createSlice({
  name: 'oss',
  initialState,
  reducers: {
    /**
     * payload: id
     */
    deleteOssConfig(state, action: PayloadAction<string>) {
      const idx = state.configs.findIndex(v => v.id === action.payload)
      if (idx < 0) {
        throw new Error('Oss config not found.')
      }
      Object.keys(state.index).forEach((key) => {
        const data = state.index[key]
        if (!data) {
          return
        }
        while (data.length > 0) {
          if (data[data.length - 1].ossId !== action.payload) {
            data.pop()
          }
        }
        if (data.length == 0) {
          state.index[key] = undefined
        }
      })

      state.configs.splice(idx, 1)
    },
    addOssConfig(state, action: PayloadAction<BaseOSSConfig>) {
      state.configs.push(action.payload)
    },
    updateOssConfig(state, action: PayloadAction<BaseOSSConfig>) {
      const idx = state.configs.findIndex(v => v.id === action.payload.id)
      if (idx < 0) {
        throw new Error('Oss config not found.')
      }
      state.configs[idx] = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(savePageData.fulfilled, (state, { payload }) => {
      const idx = state.index[payload.host]
      const entity: HostData = { ...payload }
      if (idx) {
        idx.push(entity)
      } else {
        state.index[payload.host] = [entity]
      }
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
      if (idx.length === 1) {
        state.index[payload.host] = undefined
      } else {
        idx.splice(payload.offset, 1)
      }
    })
    builder.addMatcher(isRejected, (_, action) => {
      console.error(action.error.stack)
    })
  }
})

export const { deleteOssConfig } = ossSlice.actions

export default ossSlice.reducer