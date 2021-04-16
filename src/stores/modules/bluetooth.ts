import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type bluetoothState = {
  device: any,
  bluetoothConnect: boolean
}

const initialState: bluetoothState = {
  device: null,
  bluetoothConnect: false
}

const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState,
  reducers: {
    setDevice(state, action: PayloadAction<any>) {
      state.device = action.payload
    },

    setDeviceConnect(state, action: PayloadAction<boolean>) {
      state.bluetoothConnect = action.payload
    }
  }
})

export const { setDevice, setDeviceConnect } = bluetoothSlice.actions
export default bluetoothSlice.reducer
