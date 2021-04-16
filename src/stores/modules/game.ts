import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { page } from '../../types/page'

type gameState = {
  page: page
  bgm: boolean
  resultVisible: boolean
}

const initialState: gameState = {
  page: 'GAME_START',

  bgm: false,
  resultVisible: false
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    start(state, action: PayloadAction<boolean>) {
      state.page = 'GAME_PLAY'
      state.bgm = action.payload
    },

    mapEdit(state) {
      state.page = 'MAP_EDIT'
    }
  }
})

export const { start, mapEdit } = gameSlice.actions
export default gameSlice.reducer
