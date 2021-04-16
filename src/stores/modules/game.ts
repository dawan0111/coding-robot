import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { page } from '../../types/page'

type gameState = {
  page: page
  resultVisible: boolean
  DEBUG: boolean

  playingQueue: number[]
}

const initialState: gameState = {
  page: 'GAME_PLAY',
  resultVisible: false,
  DEBUG: true,

  playingQueue: []
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

    play(state, action: PayloadAction<number[]>) {
      state.playingQueue = action.payload
    },

    end(state) {
      state.resultVisible = true
    },

    receiveData(state, action: PayloadAction<string>) {
      const value = action.payload;

      if (value === "1") {
        if (state.playingQueue.length > 0) {
          state.playingQueue.shift()
        }
      }
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

export const { start, play, end, mapEdit, toggleResult, receiveData } = gameSlice.actions
export default gameSlice.reducer
