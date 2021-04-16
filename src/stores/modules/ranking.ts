import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ranking } from '../../types/ranking'

type rankingState = {
  data: {
    [key:string]: ranking[]
  }
}

const initialState: rankingState = {
  data: JSON.parse(localStorage.getItem('ranking') || '{}')
}

const rankingSlice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    add (state, action: PayloadAction<{
      key: string
      info: ranking
    }>) {
      const { key, info } = action.payload
      if (state.data[key] === undefined) {
        state.data[key] = []
      }

      state.data[key].push(info)
      localStorage.setItem('ranking', JSON.stringify(state.data))
    },
  }
})

export const { add } = rankingSlice.actions
export default rankingSlice.reducer
