import React from 'react'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useDrag, DragSourceMonitor, XYCoord, useDrop } from 'react-dnd'

import Card from './Card'
import { draggableCard, sortCardC } from '../../types/card'
import GameContext from '../../contexts/GameContext'
import _ from 'lodash'
import AudioPlayerContext from '../../contexts/AudioContext'


export default function SortableCard({
  type, index, cardIndex, temp, parent
}: sortCardC) {
  const {
    queue,
    playArray,
    tempQueue,

    addQueue,
    changeDraggingIndex,
    replaceQueue,
    reSortSetQueue,

    draggingIndex

  } = React.useContext(GameContext)
  const { play } = React.useContext(AudioPlayerContext)
  
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

      reSortSetQueue(
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

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: "sortCard",
      aIndex: index,
      index: cardIndex,
      sort: true,
      data: { type }
    },
    begin: (monitor: DragSourceMonitor) => {
      if (cardIndex) changeDraggingIndex(cardIndex)
    },
    end: () => {
      changeDraggingIndex(Infinity)
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
        active={playArray[0] === cardIndex}
        cardIndex={cardIndex}
        type={type}
        temp={temp}
      />
    </div>
  )
}
