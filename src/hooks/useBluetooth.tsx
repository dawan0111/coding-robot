import React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'

import { useRootSelector } from './useRootState'
import { setDevice, setDeviceConnect, setReadCallback as _setReadCallback } from '../stores/modules/bluetooth'

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const windowNavigator: any = navigator

export default function useBluetooth() {
  const dispatch = useDispatch()
  const { device, bluetoothConnect, readCallback } = useRootSelector(state => state.bluetooth, shallowEqual)

  const setBluetoothDevice = React.useCallback(() => {
    return new Promise<boolean>((resolve, reject) => {
      windowNavigator.bluetooth.requestDevice({
        filters: [{ services: [0xFFE0] }]
      })
        .then(function(device: any) {
          device.addEventListener('gattserverdisconnected', () => {
            alert("디바이스 연결이 끊어졌습니다.");
            dispatch(setDevice(null))
            dispatch(setDeviceConnect(false))
          });
          return device.gatt.connect();
        }).then(function(server: any) {
          return server.getPrimaryService(0xFFE0);
        }).then(function(service: any) {
          return service.getCharacteristic(0xFFE1);
        }).then(function(characteristic: any) {
          resolve(true)
          dispatch(setDeviceConnect(true))
          dispatch(setDevice(characteristic))
  
          characteristic.startNotifications().then(() => {
            console.log("bluetooth start Notifications!")
          })
        })
        .catch(function(error: any) {
          console.error('Connection failed!', error);
          dispatch(setDevice(null))
          dispatch(setDeviceConnect(false))
          reject(false);
        });
    })
  }, [dispatch])

  const sendData = React.useCallback((data: Uint8Array) => {
    if (device !== null) {
      device.writeValue(data)
    }
  }, [device])

  const setReadCallback = (callbackFn: (e:any) => void) => {
    dispatch(_setReadCallback(callbackFn))
  }

  React.useEffect(() => {
    if (device && readCallback) {
      device.addEventListener('characteristicvaluechanged', readCallback);
    }
    return (() => {
      if (device && readCallback) {
        device.removeEventListener('characteristicvaluechanged', readCallback);
      }
    })
  }, [device, readCallback])

  return {
    device,
    bluetoothConnect,

    sendData,
    setBluetoothDevice,
    setReadCallback
  }
}