import { combineReducers } from "@reduxjs/toolkit";
import bluetooth from './bluetooth'
import dragDrop from './dragDrop'
import game from './game'
import queue from './queue'
import ranking from './ranking'

const rootReducer = combineReducers({
  bluetooth,
  dragDrop,
  game,
  queue,
  ranking
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer