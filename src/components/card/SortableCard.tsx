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
    tempQueue,

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
        if (!tempQueue) {
          return;
        }
        const tempQueueIndex = item.index === undefined ? _.findIndex(queue, ["index", tempQueue.index]) : item.index

        if (type === "temp") {
          hoverIndex = tempQueueIndex
        }

        if (hoverClientX >= hoverWidth * 0.5) {
          replaceQueue(tempQueueIndex, hoverIndex, false, true)
        } else {
          replaceQueue(tempQueueIndex, hoverIndex, false, false)
        }

        /*
        if (hoverClientX <= hoverWidth * 0.3 || hoverClientX >= hoverWidth * 0.7) {

        } else {
          if (tempQueue.parent !== cardIndex) {
            console.log("center")
            replaceQueue(tempQueueIndex, hoverIndex, type === "for", true)
          }
        }
        */
      }
    },

    drop(item: draggableCard, monitor) {
      if (monitor.didDrop()) return;

      play('drop')
      reSortSetQueue(queue)
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

  const opacity = draggingIndex === cardIndex ? 0.5 : 1;

  return (
    <div style={{ opacity, height: '100%', position: 'relative' }}>
      <div ref={ref} style={{
        position: 'absolute',
        zIndex: 100,
        left: 0,
        top: 0,
        width: "100%",
        height: '100%'
      }}></div>
      <Card
        cardIndex={cardIndex}
        type={type}
        temp={temp}
      />
    </div>
  )
}
