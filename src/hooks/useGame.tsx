import React from 'react'

import useBluetooth from './useBluetooth'
import useQueue from './useQueue'
import useMap from './useMap'

import { page } from '../types/page'

export default function useGame() {
  const [page, setPage] = React.useState<page>("GAME_PLAY")

  const bluetooth = useBluetooth({})
  const queue = useQueue()
  const map = useMap()

  return {
    page,
    bluetooth,
    queue,
    map,

    setPage
  }
}