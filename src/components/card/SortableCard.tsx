import React from 'react'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useDrag, DragSourceMonitor, XYCoord, useDrop } from 'react-dnd'

import Card from './Card'
import { draggableCard, sortCardC } from '../../types/card'
import GameContext from '../../contexts/GameContext'


export default function SortableCard({
  type, index, cardIndex
}: sortCardC) {
  const {
    changeDraggingIndex,
  } = React.useContext(GameContext)
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: "sortCard",
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

  drag(ref);

  const opacity = isDragging ? 0.5 : 1;

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
      />
    </div>
  )
}
