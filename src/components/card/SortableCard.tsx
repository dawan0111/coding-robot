import React from 'react'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useDrag, DragSourceMonitor, XYCoord, useDrop } from 'react-dnd'

import Card from './Card'
import { cardSortEvent, draggableCard, sortCardC } from '../../types/card'


export default function SortableCard({
  type, index, withDragging , moveCard, changeDraggingIndex, dropCard, updateCard }: sortCardC & cardSortEvent) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ["card", "sortCard"],
    drop() {
      dropCard()
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
        
        moveCard(dragIndex, hoverIndex)
      } else if (item.type === "card") {
        updateCard(hoverIndex);
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

  const opacity = (isDragging || withDragging) ? 0.5 : 1;

  return (
    <div ref={ref} style={{ opacity }}>
      <Card type={type} />
    </div>
  )
}
