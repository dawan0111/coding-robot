import React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { useRootSelector } from './useRootState'
import { coinT, isStartCoin } from '../types/coin'
import { set } from '../stores/modules/map'

export default function useMap() {
  const dispatch = useDispatch()
  const { data, ...mapValue } = useRootSelector(state => state.map, shallowEqual)

  const mapStartIndex = data.findIndex(isStartCoin)
  const mapEndIndex = data.findIndex((coin) => coin === "end-point")

  const moveHero = (action: string) => {
    const _map = [...data];
    const MAP_X = mapValue.x
    const MAP_Y = mapValue.y
    const direction = data[mapStartIndex];
    const move = (index:number, moveIndex: number, value: coinT) => {
      if (moveIndex < 0 || moveIndex > MAP_X * MAP_Y - 1) return;

      _map[index] = "empty";
      _map[moveIndex] = value;
    }

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

    dispatch(set(_map))
  }

  return {
    data,
    ...mapValue,
    mapStartIndex,
    mapEndIndex,
    moveHero
  }
}