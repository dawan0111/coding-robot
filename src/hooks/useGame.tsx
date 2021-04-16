import React from 'react'

import { shallowEqual, useDispatch } from 'react-redux'
import { useRootSelector } from './useRootState'
import useMap from './useMap'
import { card, cardType } from '../types/card'
import { end, play, receiveData } from '../stores/modules/game'
import { setReadCallback } from '../stores/modules/bluetooth'

export default function useGame() {
  const [tick, setTick] = React.useState<any[]>([])
  const dispatch = useDispatch()
  const { mapStartIndex, mapEndIndex } = useMap()
  const { moveHero } = useMap()
  const game = useRootSelector(state => state.game, shallowEqual)
  const queue = useRootSelector(state => state.queue.data)
  const device = useRootSelector(state => state.bluetooth.device)

  const runGame = React.useCallback(() => {
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
    let cardTypeArray: any = [];

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
        cardTypeArray.push(queueP[index].type)
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
    }

    if ((device || game.DEBUG)) {
      var leftQueue = flatArray.length
      dispatch(setReadCallback((e: any) => {
        dispatch(receiveData(e.target.value.getUint8(0).toString(10)))
        setTick(cardTypeArray[flatArray.length - leftQueue])
        leftQueue--;

        if (leftQueue <= 0) {
          dispatch(end())
        }
      }))
      if (game.DEBUG && !device) {
        let timer = setInterval(() => {
          dispatch(receiveData("1"))
          setTick([cardTypeArray[flatArray.length - leftQueue]])

          leftQueue--;
          if (leftQueue <= 0) {
            dispatch(end())
            clearTimeout(timer)
          }
        }, 1000)
      }
      dispatch(play(cardFlatArray))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStartIndex, mapEndIndex, queue, device, game.DEBUG, dispatch])

  React.useEffect(() => {
    if (tick[0]) {
      moveHero(tick[0])
    }
  }, [tick])

  return {
    ...game,

    runGame
  }
}