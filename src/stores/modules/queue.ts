import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { card, cardType } from '../../types/card'

function reSortQueue(queue: card[]): card[] {
  return queue.filter(val => val.index !== Infinity).reduce((acc, val) => (
    [...acc, {
      ...val,
      temp: false,
    }]
  ), [] as card[])
}

type queueState = {
  id: number
  data: card[]
}

const initialState: queueState = {
  id: 1,
  data: [],
}

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    add(state, action: PayloadAction<{
      type: cardType
      parent?: number
      temp?: boolean
    }>) {
      const { type, parent, temp } = action.payload
      state.data.push({
        type,
        parent,
        index: state.id,
        temp: !!temp
      })

      state.id = state.id + 1
    },

    update(state, action: PayloadAction<{
      index: number
      card: card
    }>) {
      const { index, card } = action.payload
      state.data = state.data.map(x => x.index !== index ? x : {
        ...x,
        ...card
      })
    },

    remove(state, action: PayloadAction<number>) {
      let changeQueue: Array<card> = [...state.data];

      (function del(index) {
        changeQueue.filter(val => val.parent === index).forEach((val) => {
          del(val.index)
        })
        changeQueue = changeQueue.filter(val => val.index !== index && val.parent !== index);
      })(action.payload)

      state.data = reSortQueue(changeQueue);
    },

    replace(state, action: PayloadAction<{
      draggingIndex:number
      droppingIndex:number
      isRight: boolean
    }>) {
      const { draggingIndex, droppingIndex, isRight } = action.payload
      const movingQueue = state.data[draggingIndex];
      const changeParent = state.data[droppingIndex].parent;
      const changeQueue = state.data.filter((x, index) => index !== draggingIndex && x.index !== Infinity)
      const isFront = isRight ? 1 : 0;
      const middleQueue: Array<card> = [{
        ...movingQueue,
        parent: changeParent,
      }]

      state.data = [
        ...changeQueue.slice(0, droppingIndex + isFront),
        ...middleQueue,
        ...changeQueue.slice(droppingIndex + isFront)
      ]
    },

    set(state, action: PayloadAction<card[]>) {
      state.data = reSortQueue(action.payload)
    }
  }
})

export const { add, update, replace, remove, set } = queueSlice.actions
export default queueSlice.reducer

