import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ranking } from '../../types/ranking'

type rankingState = {
  ranking: {
    [key:string]: ranking[]
  }
}

const initialState: rankingState = {
  ranking: JSON.parse(localStorage.getItem('ranking') || '{}')
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
      if (state.ranking[key] === undefined) {
        state.ranking[key] = []
      }

      state.ranking[key].push(info)
    },
  }
})

export const { add } = rankingSlice.actions
export default rankingSlice.reducer
