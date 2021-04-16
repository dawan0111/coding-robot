import { combineReducers } from "@reduxjs/toolkit";
import bluetooth from './bluetooth'
import dragDrop from './dragDrop'
import game from './game'
import queue from './queue'
import ranking from './ranking'
import map from './map'

const rootReducer = combineReducers({
  bluetooth,
  dragDrop,
  game,
  queue,
  ranking,
  map
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer