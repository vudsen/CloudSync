import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { BaseOSSConfig, OssType } from '@/oss/type.ts'

export type OssIndex = {
  configType: OssType
  snapshots: string[]
}

export type OssState = {
  configs: BaseOSSConfig[]
  /**
   * key 为网站域名
   */
  index: Record<string, OssIndex>
}

const initialState: OssState = {
  configs: [],
  index: {}
}

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
  }
})

export const { createNewOss } = ossSlice.actions

export default ossSlice.reducer