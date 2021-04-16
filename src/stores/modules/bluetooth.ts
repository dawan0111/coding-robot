import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type bluetoothState = {
  device: any,
  bluetoothConnect: boolean,
  readCallback?: (e:any) => void
}

const initialState: bluetoothState = {
  device: null,
  bluetoothConnect: false,
  readCallback: undefined
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
    },

    setReadCallback(state, action: PayloadAction<(e:any) => void>) {
      state.readCallback = action.payload
    }
  }
})

export const { setDevice, setDeviceConnect, setReadCallback } = bluetoothSlice.actions
export default bluetoothSlice.reducer
