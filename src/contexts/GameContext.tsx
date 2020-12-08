import _, { drop } from 'lodash'
import React from 'react'
import { card, cardType } from '../types/card'
import { coinT } from '../types/coin'

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const windowNavigator: any = navigator

type pageT = 'mapEdit' | 'game' | 'gameStart'

interface valueT {
  page: pageT
  map: Array<coinT>
  mapStartIndex: number
  queue: Array<card>
  tempQueue: card | undefined
  bluetoothConnect: boolean
  draggingIndex: number
  activeMap: number

  changePage: (page: pageT) => void

  addQueue: (type: cardType, parent?: number, temp?: boolean) => void
  getQueueDeps: (index: number | undefined) => number
  updateQueue: (index: number, payload: card) => void
  deleteQueue: (index: number) => void
  deleteNextQueue: (index: number) => void
  replaceQueue: (index1: number, index2: number, isRight: boolean) => void
  reSortSetQueue: (queue: Array<card>) => void

  putMap: (map: Array<coinT>) => void
  updateMap: (index: number, coin: coinT) => void

  setBluetoothDevice: () => void
  sendQueueData: () => void

  changeDraggingIndex: (index: number) => void
  changeActiveMap: (index: number) => void
}

const GameContext = React.createContext({} as valueT)

export default GameContext

export function GameContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [page, setPage] = React.useState<pageT>("mapEdit")
  const [queue, setQueue] = React.useState<Array<card>>([])
  const [map, setMap] = React.useState<Array<coinT>>(Array(20).fill("empty"))
  const [activeMap, setActiveMap] = React.useState<number>(-1)

  const [queueId, setQueueId] = React.useState(1)
  const [bluetoothConnect, setBluetoothConnect] = React.useState(false)
  const [device, setDevice] = React.useState<any>(null)
  const [draggingIndex, setDraggingIndex] = React.useState(Infinity)

  const tempQueue = React.useMemo(() => (
    queue.find(x => x.temp === true)
  ), [queue])

  const mapStartIndex = React.useMemo(() => (
    map.findIndex(x => x === "start")
  ), [map])

  const reSortSetQueue = React.useCallback((queue: Array<card>) => {
    setQueue(
      queue.reduce((acc, val) => (
        [...acc, {
          ...val,
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
        index: queueId,
        temp: temp === undefined ? false : true
      }
    ]))
    setQueueId(queueId + 1)
  }, [queueId])

  const updateQueue = React.useCallback((index: number, payload: card) => {
    setQueue(queue => (queue.map(x => x.index !== index ? x : {
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

  const getQueueDeps = React.useCallback((index) => {
    let deps = 0;

    (function find(index, queue) {
      if (index === undefined || index === -1) return deps;
      deps += 1;

      const findQueue = _.find(queue, ['index', index])
      if (findQueue) {
        find(findQueue.parent, queue)
      }
    })(index, queue)

    return deps;
  }, [queue])

  const replaceQueue = React.useCallback((draggingIndex:number, droppingIndex:number, isRight: boolean) => {
    const movingQueue = queue[draggingIndex];
    const changeParent = queue[droppingIndex].parent;
    const changeQueue = queue.filter((x, index) => index !== draggingIndex)
    const isFront = isRight ? 0 : 0;

    setQueue([
      ...changeQueue.slice(0, droppingIndex + isFront),
      {
        ...movingQueue,
        parent: changeParent
      },
      ...changeQueue.slice(droppingIndex + isFront)
    ])
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
        setDevice(characteristic)
        
        var data = new Uint8Array([0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44, 0xbb, 0x25, 0x05, 0x44]);
        return characteristic.writeValue(data);
      })
      .catch(function(error: any) {
        console.error('Connection failed!', error);
      });
  }, [])

  const sendQueueData = React.useCallback(() => {
    const hasingType: Record<cardType, number> = {
      "go": 0x01,
      "left-rotate": 0x02,
      "right-rotate": 0x03,
      "temp": -1,
      "for": -1,
      "start": -1
    }
    let flatArray: any = [];

    (function find(queueP: Array<card>, index: number) {

      if (queueP.length <= index) return;
      if (queueP[index].type === "for") {
        const loopCount = document.getElementById(`for-${queueP[index].index}`) as HTMLInputElement;
        const childrens = queue.filter(x => x.parent === queueP[index].index)

        if (loopCount) {
          Array(Number(loopCount.value)).fill(0).forEach(() => find(childrens, 0))
        }
      } else {
        flatArray.push(hasingType[queueP[index].type]);
      }

      find(queueP, index + 1)
    })(queue.filter(x => x.parent === undefined), 0)

    var data = new Uint8Array([flatArray.length, ...flatArray]);

    if (device !== null) {
      device.writeValue(data)
    }
  }, [queue, device])

  const changeDraggingIndex = React.useCallback((index: number) => {
    setDraggingIndex(index)
  }, [])

  const putMap = React.useCallback((map) => {
    setMap(map)
  }, [])

  const updateMap = React.useCallback((index, coin) => {
    setMap((_map) => (
      _map.map((val, _index) => (
        _index === index ? coin: val
      ))
    ))
  }, [])

  React.useEffect(() => {
  }, [queue])

  return (
    <GameContext.Provider value={{
      page,
      activeMap,
      map,
      mapStartIndex,
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

      getQueueDeps,

      putMap,
      updateMap,

      setBluetoothDevice,
      sendQueueData,

      changeDraggingIndex,
      changeActiveMap: setActiveMap
    }}>
      {children}
    </GameContext.Provider>
  )
}