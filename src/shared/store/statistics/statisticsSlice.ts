import { createSlice } from '@reduxjs/toolkit'

export type SavedHost = {
  /**
   * 域名
   */
  host: string
  /**
   * 占用大小(bit)
   */
  size: number
  /**
   * 类型
   */
  type: string
}

export interface StatisticsState {
  savedHosts: SavedHost[]
}

const initialState: StatisticsState = {
  savedHosts: [],
}

export const statisticsSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {

  }
})



export default statisticsSlice.reducer