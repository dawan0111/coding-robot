import _ from 'lodash'
import React from 'react'

import { useDrag, DragSourceMonitor, XYCoord, useDrop } from 'react-dnd'

import Card from './Card'
import { draggableCard, sortCardC } from '../../types/card'

import AudioPlayerContext from '../../contexts/AudioContext'
import useDragDrop from '../../hooks/useDragDrop'
import useQueue from '../../hooks/useQueue'
import { useRootSelector } from '../../hooks/useRootState'

export default function SortableCard({
  type, index, cardIndex, temp, parent
}: sortCardC) {
  const { play } = React.useContext(AudioPlayerContext)

  const { data: queue, tempQueue, addQueue, replaceQueue, setQueue } = useQueue()
  const { draggingIndex, onDrag, onDrop } = useDragDrop()
  const playingQueue = useRootSelector(state => state.game.playingQueue)
  
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isOverCurrent }, drop] = useDrop({
    accept: ["sortCard", "card"],
    hover(item: draggableCard, monitor) {
      if (!isOverCurrent || !ref.current) return;

      const hoverCard = queue.filter(x => x.parent === parent)[index]
      let hoverIndex = hoverCard ? _.findIndex(queue, ["index", hoverCard.index]) : index;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const hoverWidth = hoverBoundingRect.right - hoverBoundingRect.left 
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      if (item.type === "card") {
        if (!tempQueue) return;
        const tempQueueIndex = _.findIndex(queue, ["index", tempQueue.index])
        const isRight = hoverClientX >= hoverWidth * 0.5;
        if (hoverIndex === tempQueueIndex || (isRight && hoverIndex + 1 === tempQueueIndex)) return;

        if (isRight) {
          replaceQueue(tempQueueIndex, hoverIndex, true)
        } else {
          replaceQueue(tempQueueIndex, hoverIndex, false)
        }
      } else {
        if (!tempQueue) {
          addQueue(item.data.type, parent, true);
        }
        item.type = "card"
      }
    },

    drop(item: draggableCard, monitor) {
      if (monitor.didDrop() || !ref.current) return;

      setQueue(
        queue
          .map((val) => {
            return val.parent === draggingIndex ? ({
              ...val,
              parent: tempQueue ? tempQueue.index : val.parent
            }) : val
          })
          .filter((val) => val.index !== draggingIndex)
      )

      play('drop')
      return undefined
    },

    collect: (monitor) => ({
      hovered: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      item: monitor.getItem(),
    })
  })

  const [, drag] = useDrag({
    item: {
      type: "sortCard",
      aIndex: index,
      index: cardIndex,
      sort: true,
      data: { type }
    },
    begin: (monitor: DragSourceMonitor) => {
      if (cardIndex) onDrag(cardIndex)
    },
    end: () => {
      onDrop()
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drop(drag(ref));

  return (
    <div ref={ref} style={{
      display: draggingIndex === cardIndex ? "none" : "block",
      opacity: 1,
      height: '50%',
      position: 'relative'
    }}>
      <Card
        active={playingQueue[0] === cardIndex}
        cardIndex={cardIndex}
        type={type}
        temp={temp}
      />
    </div>
  )
}
