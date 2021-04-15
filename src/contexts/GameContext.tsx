import _ from 'lodash'
import React from 'react'
import { card, cardType } from '../types/card'
import { coinT, isStartCoin } from '../types/coin'
import { rankingT } from '../types/ranking'

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const windowNavigator: any = navigator

type pageT = 'mapEdit' | 'game' | 'gameStart'

interface valueT {
  mapX: number
  mapY: number
  page: pageT
  map: Array<coinT>
  mapStartIndex: number
  mapEndIndex: number
  queue: Array<card>
  playArray: Array<number>
  tempQueue: card | undefined
  bluetoothConnect: boolean
  draggingIndex: number
  activeMap: number
  score: number

  resultVisible: boolean

  ranking: Record<string, Array<rankingT>>

  changePage: (page: pageT) => void

  addQueue: (type: cardType, parent?: number, temp?: boolean) => void
  getQueueDeps: (index: number | undefined) => number
  updateQueue: (index: number, payload: card) => void
  deleteQueue: (index: number) => void
  deleteNextQueue: (index: number) => void
  replaceQueue: (index1: number, index2: number, isFor: boolean, isRight: boolean) => void
  reSortSetQueue: (queue: Array<card>) => void

  putMap: (map: Array<coinT>) => void
  updateMap: (index: number, coin: coinT) => void
  saveMap: () => void

  setBluetoothDevice: () => void
  sendQueueData: () => void
  sendResetMessage: () => void

  changeDraggingIndex: (index: number) => void
  changeActiveMap: (index: number) => void

  updateResultVisible: (bool: boolean) => void

  addRanking: (name: string) => void
}

const GameContext = React.createContext({} as valueT)

export default GameContext

const MAP_X = 4
const MAP_Y = 4
const defaultMap = Array(MAP_X * MAP_Y).fill("empty");
defaultMap[0] = "start-right";

export function GameContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [page, setPage] = React.useState<pageT>("game")
  const [queue, setQueue] = React.useState<Array<card>>([])
  const [map, setMap] = React.useState<Array<coinT>>(
    localStorage.getItem("map") ? JSON.parse(localStorage.getItem("map") || "[]") : defaultMap
  )
  const [activeMap, setActiveMap] = React.useState<number>(-1)
  const [resultVisible, setResultVisible] = React.useState(false)

  const [ranking, setRanking] = React.useState(JSON.parse(localStorage.getItem("ranking") || "{}"))
  const [queueId, setQueueId] = React.useState(1)
  const [bluetoothConnect, setBluetoothConnect] = React.useState(false)
  const [device, setDevice] = React.useState<any>(null)
  const [draggingIndex, setDraggingIndex] = React.useState(Infinity)

  const [playArray, setPlayArray] = React.useState([])

  const score = React.useMemo(() => (
    9000 - queue.length * 100
  ), [queue])

  const tempQueue = React.useMemo(() => (
    queue.find(x => x.temp === true)
  ), [queue])

  const mapStartIndex = React.useMemo(() => (
    map.findIndex(isStartCoin)
  ), [map])

  const mapEndIndex = React.useMemo(() => (
    map.findIndex((coin) => coin === "end-point")
  ), [map])

  const reSortSetQueue = React.useCallback((queue: Array<card>) => {
    setQueue(
      queue.filter(val => val.index !== Infinity).reduce((acc, val) => (
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
    let changeQueue: Array<card> = [...queue];

    (function del(index) {
      changeQueue.filter(val => val.parent === index).forEach((val) => {
        del(val.index)
      })
      changeQueue = changeQueue.filter(val => val.index !== index && val.parent !== index);
    })(index)

    reSortSetQueue(changeQueue);
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

  const replaceQueue = React.useCallback((draggingIndex:number, droppingIndex:number, isFor: boolean, isRight: boolean) => {
    const movingQueue = queue[draggingIndex];
    const changeParent = queue[droppingIndex].parent;
    const changeQueue = queue.filter((x, index) => index !== draggingIndex && x.index !== Infinity)
    const isFront = isRight ? 1 : 0;
    let middleQueue: Array<card> = []

    middleQueue = [{
      ...movingQueue,
      parent: changeParent,
    }]

    setQueue([
      ...changeQueue.slice(0, droppingIndex + isFront),
      ...middleQueue,
      ...changeQueue.slice(droppingIndex + isFront)
    ])
  }, [queue])

  const setBluetoothDevice = React.useCallback(() => {
    windowNavigator.bluetooth.requestDevice({
      filters: [{ services: [0xFFE0] }]
    })
      .then(function(device: any) {
        device.addEventListener('gattserverdisconnected', () => {
          alert("디바이스 연결이 끊어졌습니다.");

          setDevice(null)
          setBluetoothConnect(false)
        });
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
        characteristic.startNotifications().then(() => {
          console.log("aaa")
        })
      })
      .catch(function(error: any) {
        console.error('Connection failed!', error);
      });
  }, [])

  const sendQueueData = React.useCallback(() => {
    if (mapStartIndex === -1 && mapEndIndex === -1) {
      alert("맵에 시작부분과 끝 부분 모두 설정해주세요!");
      return;
    }
    const hasingType: Record<cardType, number> = {
      "go": 0x01,
      "left-rotate": 0x02,
      "right-rotate": 0x03,
      "temp": -1,
      "for": -1,
      "start": -1
    }
    let flatArray: any = [];
    let cardFlatArray: any = [];

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
        cardFlatArray.push(queueP[index].index)
      }

      find(queueP, index + 1)
    })(queue.filter(x => x.parent === undefined), 0)

    if (flatArray.length > 90) {
      alert("실행 횟수가 너무 길어요!");
      return;
    }

    var data = new Uint8Array([0x04, ...flatArray, 0x04]);

    if (device !== null) {
      device.writeValue(data)
      setPlayArray(cardFlatArray)
    }
  }, [queue, device, mapStartIndex])

  const sendResetMessage = React.useCallback(() => {
    if (device !== null) {
      const data = new Uint8Array([0x05])
      device.writeValue(data)
    }
  }, [device])

  const changeDraggingIndex = React.useCallback((index: number) => {
    setDraggingIndex(index)
  }, [])

  const putMap = React.useCallback((map, save = true) => {
    setMap(map)
  }, [])

  const updateMap = React.useCallback((index, coin) => {
    setMap((_map) => (
      _map.map((val, _index) => (
        _index === index ? coin: val
      ))
    ))
  }, [])

  const saveMap = React.useCallback(() => {
    localStorage.setItem("map", JSON.stringify(map));
  }, [map])

  const moveRabbit = React.useCallback((cardIndex: number) => {
    const _map = [...map];
    const direction = map[mapStartIndex];
    const move = (index:number, moveIndex: number, value: coinT) => {
      if (moveIndex < 0 || moveIndex > MAP_X * MAP_Y - 1) return;

      _map[index] = "empty";
      _map[moveIndex] = value;
    }

    const action = _.find(queue, ["index", cardIndex])?.type;

    if (!action) return;
   
    if (direction === "start-left") {
      if (action === "go") {
        if (mapStartIndex % MAP_X !== 0) {
          move(mapStartIndex, mapStartIndex - 1, direction);
        }
      } else if (action === "left-rotate") {
        move(mapStartIndex, mapStartIndex, "start-down");
      } else if (action === "right-rotate") {
        move(mapStartIndex, mapStartIndex, "start-up");
      }
    } else if (direction === "start-up") {
      if (action === "go") {
        move(mapStartIndex, mapStartIndex - MAP_X, direction);
      } else if (action === "left-rotate") {
        move(mapStartIndex, mapStartIndex, "start-left");
      } else if (action === "right-rotate") {
        move(mapStartIndex, mapStartIndex, "start-right");
      }
    } else if (direction === "start-right") {
      if (action === "go") {
        if (mapStartIndex % MAP_X !== MAP_X - 1) {
          move(mapStartIndex, mapStartIndex + 1, direction);
        }
      } else if (action === "left-rotate") {
        move(mapStartIndex, mapStartIndex, "start-up");
      } else if (action === "right-rotate") {
        move(mapStartIndex, mapStartIndex, "start-down");
      }
    } else if (direction === "start-down") {
      if (action === "go") {
        move(mapStartIndex, mapStartIndex + MAP_X, direction);
      } else if (action === "left-rotate") {
        move(mapStartIndex, mapStartIndex, "start-right");
      } else if (action === "right-rotate") {
        move(mapStartIndex, mapStartIndex, "start-left");
      }
    }

    putMap(_map, false)
  }, [queue, map, putMap, mapStartIndex])

  const addRanking = React.useCallback((name) => {
    const _ranking = {...ranking}
    const hashKey = localStorage.getItem("map") || "";
    if (_ranking[hashKey] === undefined) {
      _ranking[hashKey] = [];
    }

    _ranking[hashKey].push({
      name,
      score: score
    })

    setRanking(_ranking)
    localStorage.setItem("ranking", JSON.stringify(_ranking))
  }, [ranking, map, score])

  const updateResultVisible = React.useCallback((bool) => {
    setResultVisible(bool)
  }, [])

  const gameEnd = React.useCallback(() => {
    updateResultVisible(true);
  }, [])

  React.useEffect(() => {
    if (!localStorage.getItem("map")) {
      localStorage.setItem("map", JSON.stringify(defaultMap)) 
    }
  }, [])

  React.useEffect(() => {
    const handleChanged = (e: any) => {
      const value = e.target.value.getUint8(0).toString(10);
      console.log(value);

      if (value === "1") {
        if (playArray.length > 0) {
          moveRabbit(playArray[0]);
          setPlayArray(playArray => playArray.slice(1))
        }
        
        if (playArray.length === 1) {
          gameEnd();
        }
      }
    }

    if (device) {
      device.addEventListener('characteristicvaluechanged', handleChanged);
    }
    
    return (() => {
      if (device) {
        device.removeEventListener('characteristicvaluechanged', handleChanged);
      }
    })
  }, [device, playArray, gameEnd, moveRabbit])


  return (
    <GameContext.Provider value={{
      mapX: MAP_X,
      mapY: MAP_Y,
      page,
      activeMap,
      map,
      mapStartIndex,
      mapEndIndex,
      queue,
      playArray,
      tempQueue,
      bluetoothConnect,
      draggingIndex,
      ranking,
      score,
      resultVisible,

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
      saveMap,

      setBluetoothDevice,
      sendQueueData,
      sendResetMessage,

      updateResultVisible,
      addRanking,

      changeDraggingIndex,
      changeActiveMap: setActiveMap
    }}>
      {children}
    </GameContext.Provider>
  )
}