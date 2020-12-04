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
    queue,
    tempQueue,
    draggingIndex,

    replaceQueue,
    changeDraggingIndex,
    reSortSetQueue
} = React.useContext(GameContext)

  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ["card", "sortCard"],
    drop() {
      reSortSetQueue(queue)
    },
    hover(item: draggableCard, monitor) {
      const dragIndex = item.index;
      const hoverIndex = index;
        
      if (item.type === "sortCard") {
        if (!ref.current) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
  
        if (
          (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
          (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
        ) {
          return;
        }
        
        replaceQueue(dragIndex, hoverIndex)
      } else if (item.type === "card") {
        if (tempQueue) {
          replaceQueue(tempQueue.index, index)
        }
      }
    }
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: "sortCard",
      index,
      sort: true,
      data: { type }
    },
    begin: (monitor: DragSourceMonitor) => {
      changeDraggingIndex(index)
    },
    end: () => {
      changeDraggingIndex(Infinity)
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  drag(drop(ref));

  const withDragging = cardIndex && cardIndex >= draggingIndex;
  const opacity = (isDragging || withDragging) ? 0.5 : 1;

  return (
    <div style={{ opacity, height: '100%', position: 'relative' }}>
      <div ref={ref} style={{
        position: 'absolute',
        zIndex: 999,
        left: 0,
        top: 0,
        width: type === "for" ? '1rem' : "100%",
        height: '100%'
      }}></div>
      <Card
        cardIndex={index}
        type={type}
      />
    </div>
  )
}
