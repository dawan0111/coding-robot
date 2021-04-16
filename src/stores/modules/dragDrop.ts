import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type dragDropState = {
  draggingIndex: number,
}

const initialState: dragDropState = {
  draggingIndex: Infinity,
}

const dragDropSlice = createSlice({
  name: 'dragDrop',
  initialState,
  reducers: {
    drag(state, action: PayloadAction<number>) {
      state.draggingIndex = action.payload
    },

    drop(state) {
      state.draggingIndex = Infinity
    }
  }
})

export const { drag, drop } = dragDropSlice.actions
export default dragDropSlice.reducer
