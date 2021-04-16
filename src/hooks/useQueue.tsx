import _ from 'lodash'
import React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { useRootSelector } from './useRootState'
import { add, update, replace, remove, set } from '../stores/modules/queue'
import { card, cardType } from '../types/card'

export default function useQueue() {
  const dispatch = useDispatch()
  const { data } = useRootSelector(state => state.queue, shallowEqual)

  const addQueue = React.useCallback((type: cardType, parent?: number, temp?: boolean ) => {
    dispatch(add({
      type,
      parent,
      temp
    }))
  }, [dispatch])

  const updateQueue = React.useCallback((index: number, card: card ) => {
    dispatch(update({
      index,
      card
    }))
  }, [dispatch])

  const removeQueue = React.useCallback((index: number) => {
    dispatch(remove(index))
  }, [dispatch])

  const replaceQueue = React.useCallback((draggingIndex: number, droppingIndex: number, isRight: boolean) => {
    dispatch(replace({
      draggingIndex,
      droppingIndex,
      isRight
    }))
  }, [dispatch])

  const setQueue = React.useCallback((cards: card[]) => {
    dispatch(set(cards))
  }, [dispatch])

  const getQueueDeps = React.useCallback((index) => {
    let deps = 0;

    (function find(index, queue) {
      if (index === undefined || index === -1) return deps;
      deps += 1;

      const findQueue = _.find(queue, ['index', index])
      if (findQueue) {
        find(findQueue.parent, queue)
      }
    })(index, data)

    return deps;
  }, [data])

  const tempQueue = React.useMemo(() => (
    data.find(x => x.temp === true)
  ), [data])

  return {
    data,
    tempQueue,

    addQueue,
    updateQueue,
    removeQueue,
    replaceQueue,
    setQueue,
    getQueueDeps
  }
}