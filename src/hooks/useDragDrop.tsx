import React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'

import { useRootSelector } from './useRootState'
import { drag, drop } from '../stores/modules/dragDrop'

export default function useDragDrop() {
  const { draggingIndex } = useRootSelector(state => state.dragDrop, shallowEqual)
  const dispatch = useDispatch()

  const onDrag = React.useCallback((index: number) => {
    dispatch(drag(index))
  }, [dispatch])

  const onDrop = React.useCallback(() => {
    dispatch(drop())
  }, [dispatch])

  return {
    draggingIndex,

    onDrag,
    onDrop
  }
}
