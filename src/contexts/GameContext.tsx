import _, { drop } from 'lodash'
import React from 'react'
import { card, cardType } from '../types/card'

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const windowNavigator: any = navigator

type pageT = 'mapEdit' | 'game'

interface valueT {
  page: pageT
  queue: Array<card>
  tempQueue: card | undefined
  bluetoothConnect: boolean
  draggingIndex: number

  changePage: (page: pageT) => void

  addQueue: (type: cardType, parent?: number, temp?: boolean) => void
  updateQueue: (index: number, payload: card) => void
  deleteQueue: (index: number) => void
  deleteNextQueue: (index: number) => void
  replaceQueue: (index1: number, index2: number) => void
  reSortSetQueue: (queue: Array<card>) => void

  setBluetoothDevice: () => void

  changeDraggingIndex: (index: number) => void
}

const GameContext = React.createContext({} as valueT)

export default GameContext

export function GameContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [page, setPage] = React.useState<pageT>("mapEdit")
  const [queue, setQueue] = React.useState<Array<card>>([])
  const [bluetoothConnect, setBluetoothConnect] = React.useState(false)
  const [draggingIndex, setDraggingIndex] = React.useState(Infinity)

  const tempQueue = React.useMemo(() => (
    queue.find(x => x.temp === true)
  ), [queue])

  const reSortSetQueue = React.useCallback((queue: Array<card>) => {
    let currentIndex = 0;

    setQueue(
      queue.reduce((acc, val) => (
        [...acc, {
          ...val,
          index: currentIndex++,
          temp: false,
        }]
      ), [] as Array<card>)
    )
  }, [])

  const addQueue = React.useCallback((type: cardType, parent?: number, temp?: boolean) => {
    setQueue(queue => ([
      ...queue,
      {
        type,
        parent,
        index: queue.length,
        temp: temp === undefined ? false : true
      }
    ]))
  }, [])

  const updateQueue = React.useCallback((index: number, payload: card) => {
    setQueue(queue => (queue.map(x => x.index === index ? x : {
      ...x,
      ...payload
    })))
  }, [])

  const deleteQueue = React.useCallback((index: number) => {
    reSortSetQueue(queue.filter(val => val.index !== index))
  }, [reSortSetQueue, queue])

  const deleteNextQueue = React.useCallback((index: number) => {
    reSortSetQueue(queue.filter(val => val.index < index))
  }, [reSortSetQueue, queue])

  const replaceQueue = React.useCallback((draggingIndex:number, droppingIndex:number) => {
    const putIndex = _.findIndex(queue, ['index', droppingIndex])
    const movingQueue = queue
      .filter(x => x.index >= draggingIndex)

    let changeQueue = queue.reduce((acc, val, index) => {
      if (putIndex === index) acc = [...acc, ...movingQueue]
      if (val.index >= draggingIndex) return acc;

      return [...acc, val]
    }, [] as Array<card>)

    if (putIndex === -1) changeQueue = [...changeQueue, ...movingQueue]

    setQueue(changeQueue)
  }, [queue])

  const setBluetoothDevice = React.useCallback(() => {
    windowNavigator.bluetooth.requestDevice({
      filters: [{ services: [0xFFE0] }]
    })
      .then(function(device: any) {
        return device.gatt.connect();
      })
      .then(function(server: any) {
        return server.getPrimaryService(0xFFE0);
      })
      .then(function(service: any) {
        return service.getCharacteristic(0xFFE1);
      })
      .then(function(characteristic: any) {
        setBluetoothConnect(true)
        
        var data = new Uint8Array([0xbb, 0x25, 0x05, 0x44]);
        return characteristic.writeValue(data);
      })
      .catch(function(error: any) {
        console.error('Connection failed!', error);
      });
  }, [])

  const changeDraggingIndex = React.useCallback((index: number) => {
    setDraggingIndex(index)
  }, [])

  React.useEffect(() => {
    console.log(queue)
  }, [queue])

  return (
    <GameContext.Provider value={{
      page,
      queue,
      tempQueue,
      bluetoothConnect,
      draggingIndex,

      changePage: setPage,

      addQueue,
      updateQueue,
      deleteQueue,
      deleteNextQueue,
      replaceQueue,
      reSortSetQueue,

      setBluetoothDevice,

      changeDraggingIndex
    }}>
      {children}
    </GameContext.Provider>
  )
}