import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cardType } from '../../types/card'
import { coinT } from '../../types/coin'

type mapState = {
  data: coinT[]
  x: number
  y: number
  active: number
}

const MAP_X = 4
const MAP_Y = 4
const defaultMap = Array(MAP_X * MAP_Y).fill("empty");
defaultMap[0] = "start-right";

const initialState: mapState = {
  data: localStorage.getItem("map") ? JSON.parse(localStorage.getItem("map") || "[]") : defaultMap,
  x: MAP_X,
  y: MAP_Y,
  active: -1,
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    set (state, action: PayloadAction<coinT[]>) {
      state.data = action.payload
    },

    update (state, action: PayloadAction<{
      index: number
      coin: coinT
    }>) {
      const { index, coin } = action.payload
      if (MAP_X * MAP_Y > index && index >= 0) {
        state.data[index] = coin
      } else {
        console.log("unvalid index value: ", index)
      }
    },

    activeOffset(state, action:PayloadAction<number>) {
      state.active = action.payload
    },

    save(state) {
      localStorage.setItem("map", JSON.stringify(state.data));
    },
  }
})

export const { set, update, save, activeOffset } = mapSlice.actions
export default mapSlice.reducer
