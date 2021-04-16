import React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { useRootSelector } from './useRootState'
import { start, mapEdit, toggleResult } from '../stores/modules/game'

export default function useGame() {
  const dispatch = useDispatch()
  const game = useRootSelector(state => state.game, shallowEqual)

  const startGame = React.useCallback(() => {
    dispatch(start())
  }, [dispatch])

  const changeMapEdit = React.useCallback(() => {
    dispatch(mapEdit())
  }, [dispatch])

  const changeVisibleResult = React.useCallback((visible ?: boolean) => {
    dispatch(toggleResult(visible))
  }, [dispatch])

  return {
    ...game,

    startGame,
    changeMapEdit,
    changeVisibleResult
  }
}