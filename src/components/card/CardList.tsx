import React from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import AudioPlayerContext from '../../contexts/AudioContext'
import GameContext from '../../contexts/GameContext'
import useDragDrop from '../../hooks/useDragDrop'
import useQueue from '../../hooks/useQueue'
import { card, draggableCard } from '../../types/card'
import Card from './Card'
import SortableCard from './SortableCard'

const Wrapper = styled.div<{ deps: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 0;

  & .item:not(.for) {
    width: ${props => `${2.45 - props.deps * 0.25}rem`};
  }

  & .item {
    height: ${props => `${2.45 - props.deps * 0.25}rem`}
  }

  & .forStack {
    min-width: ${props => `${2.45 - (props.deps + 1) * 0.25}rem`};
  }
`

type Props = {
  cards?: Array<card>
  parent?: number
}

export const SortCardList = React.memo(function({ parent }: Props) {
  const {
    data: queue,
    tempQueue,

    addQueue,
    removeQueue,
    getQueueDeps,
    updateQueue,
    setQueue
  } = useQueue()
  const { draggingIndex } = useDragDrop()

  const { play } = React.useContext(AudioPlayerContext)
  const deps = getQueueDeps(parent)

  const [{ hovered, item, isOverCurrent }, drop] = useDrop({
    accept: ["card", "sortCard"],

    hover() {
      if (isOverCurrent && tempQueue && parent !== tempQueue.parent) {
        updateQueue(tempQueue.index, {
          ...tempQueue,
          parent
        })
      }
    },

    drop(item: draggableCard, monitor) {
      if (monitor.didDrop()) return;

      play('drop')
      
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
      return undefined
    },

    collect: (monitor) => ({
      hovered: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      item: monitor.getItem(),
    }),
  })

  React.useEffect(() => {
    if (parent === undefined) {
      if (!tempQueue && hovered) {
        addQueue(item.data.type, parent, true)
      } else if (tempQueue && !hovered) {
        removeQueue(tempQueue.index);
      }
    }
  }, [hovered])

  const queues = queue.filter(x => x.parent === parent);

  return (
    <Wrapper deps={deps} ref={drop}>
      {queues.map((val, k) => (
        <div
          key={val.index}
          style={{
            position: 'relative',
            opacity: val.temp ? 0.5 : 1,
          }}
        >
          {
            !val.temp ? (
              <SortableCard
                parent={val.parent}
                type={val.type}
                cardIndex={val.index}
                index={k}
                temp={val.temp}
              />
            ) : (
              <Card
                cardIndex={val.index}
                type={val.type}
                temp={val.temp}
              />
            )
          }
        </div>
      ))}
      {
        (parent === undefined) && (
          <>
            <div style={{
                position: 'relative',
            }}>
              <Card
                cardIndex={Infinity}
                type="temp"
                temp={true}
              />
            </div>
            <div style={{
                position: 'relative',
            }}>
              <Card
                cardIndex={Infinity}
                type="temp"
                temp={true}
              />
            </div>
          </>
        )
      }
    </Wrapper>
  )
})

export default function CardList({ cards = [] }: Props) {
  return (
    <Wrapper deps={0}>
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
            temp={false}
          />
        </div>
      ))}
    </Wrapper>
  )
}
