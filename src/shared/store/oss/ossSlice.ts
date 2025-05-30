import type {Draft, PayloadAction} from '@reduxjs/toolkit'
import { isRejected } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { BaseOSSConfig } from '@/oss/type.ts'
import { createOSSInstance } from '@/oss/factory.ts'
import type { AppThunk, RootState } from '@/store'
import { deleteHostData, listHostData, saveHostData, updateHostData } from '@/core/host-data'

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

export type OssState = {
  configs: BaseOSSConfig[]
  /**
   * 使用 selector 获取该值，当保存配置时会自动更新
   */
  version: number
}

const initialState: OssState = {
  configs: [],
  version: 0,
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

export const savePageData = createAsyncThunk('oss/savePageData', async (data: SaveDataActionParam) => {
  const oss = createOSSInstance(data.config)
  const id = Date.now().toString(10)
  const key = createPageDataKey(data.host, id)
  await oss.insert(key, JSON.stringify(data.items))
  await saveHostData(data.host, {
    ossId: data.config.id,
    id,
    name: data.name,
    updateDate: Date.now(),
    remoteKey: key
  })
})

type UpdateDataActionParam = {
  hostDataId: string
  config: BaseOSSConfig
  host: string
  entity: {
    name?: string
    items?: StorageItem[]
    newOssConfig?: BaseOSSConfig
  }
}

export const replacePageData = createAsyncThunk('oss/replacePageData', async (data: UpdateDataActionParam) => {
  const indexes = await listHostData(data.host)
  if (!indexes) {
    throw new Error(`Host not found for ${data.host}`)
  }
  const hostData = indexes.find(index => index.id === data.hostDataId)
  if (!hostData) {
    throw new Error(`Host data not found for ${data.hostDataId}`)
  }
  const oldOss = createOSSInstance(data.config)
  if (data.entity.newOssConfig) {
    await oldOss.delete(hostData.remoteKey)
    const newOss = createOSSInstance(data.entity.newOssConfig)
    await newOss.insert(hostData.remoteKey, JSON.stringify(data.entity.items))
  } else {
    await oldOss.insert(hostData.remoteKey, JSON.stringify(data.entity.items))
  }
  
  await updateHostData(data.host, hostData.id, {
    name: data.entity.name,
    ossId: data.entity.newOssConfig?.id
  })
})

export const deletePageData = createAsyncThunk('oss/deletePageData', async (data: {hostData: HostData, host: string}, thunkAPI) => {
  await deleteHostData(data.host, data.hostData.id)
  const ossConfig = (thunkAPI.getState() as RootState).oss.configs.find(v => v.id === data.hostData.ossId)
  if (!ossConfig) {
    throw new Error(`OSS config not found for ${data.hostData.ossId}`)
  }
  const oss = createOSSInstance(ossConfig)
  const remoteKey = createPageDataKey(data.host, data.hostData.id)
  await oss.delete(remoteKey)
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
      // TODO 移除保存的数据
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
    const addVersion = (state: Draft<OssState>) => {
      state.version++
    }

    builder.addCase(savePageData.fulfilled, addVersion)
    builder.addCase(replacePageData.fulfilled, addVersion)
    builder.addCase(deletePageData.fulfilled, addVersion)
    builder.addMatcher(isRejected, (_, action) => {
      console.error(action.error.stack)
    })
  }
})

export const { deleteOssConfig } = ossSlice.actions

export default ossSlice.reducer