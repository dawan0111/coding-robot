import React from 'react'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useDrag, DragSourceMonitor } from 'react-dnd'

import Card from './Card'
import { cardC } from '../../types/card'

type Props = {
  val: number
  begin?: () => void
} & cardC 

export default function DraggableCard({ type, val }: Props) {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: "card", data: { type } },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  return (
    <div ref={drag}>
      <Card type={type} cardIndex={-1} />
    </div>
  )
}
