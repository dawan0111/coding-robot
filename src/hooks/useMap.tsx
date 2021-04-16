import React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { useRootSelector } from './useRootState'
import { set, update, save, activeOffset } from '../stores/modules/map'
import { coinT, isStartCoin } from '../types/coin'

export default function useMap() {
  const dispatch = useDispatch()
  const { data, ...mapValue } = useRootSelector(state => state.map, shallowEqual)

  const setMap = React.useCallback((map: coinT[]) => {
    dispatch(set(map))
  }, [dispatch])

  const updateMap = React.useCallback((index:number, coin: coinT) => {
    dispatch(update({
      index,
      coin
    }))
  }, [dispatch])

  const changeActiveOffset = React.useCallback((index: number) => {
    dispatch(activeOffset(index))
  }, [dispatch])

  const saveMap = React.useCallback(() => {
    dispatch(save())
  }, [dispatch])

  const mapStartIndex = data.findIndex(isStartCoin)
  const mapEndIndex = data.findIndex((coin) => coin === "end-point")

  return {
    data,
    ...mapValue,
    mapStartIndex,
    mapEndIndex,

    setMap,
    updateMap,
    saveMap,
    changeActiveOffset
  }
}