import React from 'react'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useDrag, DragSourceMonitor, XYCoord, useDrop } from 'react-dnd'

import Card from './Card'
import { draggableCard, sortCardC } from '../../types/card'
import GameContext from '../../contexts/GameContext'
import _ from 'lodash'


export default function SortableCard({
  type, index, cardIndex, temp, parent
}: sortCardC) {
  const {
    queue,
    tempQueue,

    changeDraggingIndex,
    replaceQueue,

    draggingIndex

  } = React.useContext(GameContext)
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isOverCurrent }, drop] = useDrop({
    accept: ["sortCard", "card"],
    hover(item: draggableCard, monitor) {
      if (!isOverCurrent || !ref.current) return;

      const hoverCard = queue.filter(x => x.parent === parent)[index]
      const hoverIndex = hoverCard ? _.findIndex(queue, ["index", hoverCard.index]) : index;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const hoverWidth = hoverBoundingRect.right - hoverBoundingRect.left 
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      if (item.type === "card") {
        if (!tempQueue) {
          return;
        }
        const tempQueueIndex = item.index === undefined ? _.findIndex(queue, ["index", tempQueue.index]) : item.index

        if (hoverWidth / 2 >= hoverClientX) {
          replaceQueue(tempQueueIndex, hoverIndex, false)
        } else {
          replaceQueue(tempQueueIndex, hoverIndex, true)
        }
      }
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
