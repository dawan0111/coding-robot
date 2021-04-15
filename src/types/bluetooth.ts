export type bluetooth = {
  device: any
  bluetoothConnect: boolean
  setBluetoothDevice: () => Promise<boolean>
}