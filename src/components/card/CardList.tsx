import React from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import AudioPlayerContext from '../../contexts/AudioContext'
import GameContext from '../../contexts/GameContext'
import { card, cardSortEvent, draggableCard } from '../../types/card'
import Card from './Card'
import SortableCard from './SortableCard'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 0;
`

type Props = {
  cards?: Array<card>
  parent?: number
}

export function SortCardList({ parent }: Props) { 
  const {
    queue,
    tempQueue,
    addQueue, 
    deleteQueue,
    reSortSetQueue
  } = React.useContext(GameContext)

  const { play } = React.useContext(AudioPlayerContext)

  const [{ hovered, item }, drop] = useDrop({
    accept: "card",

    hover() {
      console.log("aaa")
    },

    drop(item: draggableCard, monitor) {
      if (monitor.didDrop()) return;

      play('drop')
      reSortSetQueue(queue)
      return undefined
    },

    collect: (monitor) => ({
      hovered: monitor.isOver(),
      item: monitor.getItem(),
    }),
  })

  React.useEffect(() => {
    if (parent === undefined) {
      if (!tempQueue && hovered) {
        addQueue(item.data.type, parent, true)
      } else if (tempQueue && !hovered) {
        deleteQueue(tempQueue.index);
      }
    }
  }, [hovered])

  return (
    <Wrapper ref={drop}>
      {queue.filter(x => x.parent === parent).map((val, k) => (
        <div
          key={val.index}
          style={{
            position: 'relative',
            opacity: val.temp ? 0.5 : 1,
          }}
        >
          <SortableCard
            type={val.type}
            cardIndex={val.index}
            index={k}
          />
        </div>
      ))}
    </Wrapper>
  )
}

export default function CardList({ cards = [] }: Props) {
  return (
    <Wrapper>
      {cards.map((val, k) => (
        <div
          key={k}
          style={{
            position: 'relative',
            left: `${(k + 1) * -0.38}rem`
          }}
        >
          <Card
            cardIndex={val.index}
            type={val.type}
          />
        </div>
      ))}
    </Wrapper>
  )
}
