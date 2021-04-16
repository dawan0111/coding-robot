import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { page } from '../../types/page'

type gameState = {
  page: page
  resultVisible: boolean
}

const initialState: gameState = {
  page: 'GAME_START',
  resultVisible: false
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    start(state) {
      state.page = 'GAME_PLAY'
    },

    mapEdit(state) {
      state.page = 'MAP_EDIT'
    },

    toggleResult(state, action: PayloadAction<boolean | undefined>) {
      if (action.payload === undefined) {
        state.resultVisible = !state.resultVisible
      } else {
        state.resultVisible = action.payload
      }
    }
  }
})

export const { start, mapEdit, toggleResult } = gameSlice.actions
export default gameSlice.reducer
