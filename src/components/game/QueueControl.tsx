import React from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'

import { card, draggableCard } from '../../types/card'
import Card from '../card/Card'

import playImg from '../../images/play.svg'
import GameContext from '../../contexts/GameContext'
import { SortCardList } from '../card/CardList'

const QueueForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  margin-top: 1rem;
  margin-bottom: 1rem;
`

const QueueWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 60%;
  overflow: auto;

  box-shadow: inset 1px 1px 1px rgba(0, 0, 0, .5);
  border-radius: 100rem;

  padding-top: .5rem;
  padding-bottom: .5rem;
  padding-left: .8rem;
  padding-right: .8rem;

  margin-right: 1rem;

  background: #72d4c7;
`

const Queue = styled.div`
  flex: 1;
  font-size: 0;
`

const PlayBtn = styled.div`
  position: relative;
  z-index: 2;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  font-size: 0;

  &:before {
    position: absolute;
    z-index: -1;
    left: 0;
    bottom: -.25rem;
    width: 100%;
    height: 100%;

    border-radius: 50%;

    background: #db7e19;
    content: '';
  }
`

const PlayBtnWrapper = styled.div<{pushing: boolean}>`
  position: relative;
  bottom: ${props => props.pushing ? '-0.25rem' : '0'};
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background: #f6941b;
  border-radius: 50%;

  transition: 150ms ease;

  img {
    width: 30%;
  }
`

export default function QueueControl() {
  const {
      queue,
      tempQueue,
      draggingIndex,
      addQueue, 
      updateQueue,
      deleteQueue,
      replaceQueue,
      changeDraggingIndex,
      reSortSetQueue
  } = React.useContext(GameContext)
  const [pushing, setPushing] = React.useState(false)

  const [{ hovered, item }, drop] = useDrop({
    accept: "card",
    drop(item: draggableCard, monitor) {
      reSortSetQueue(queue)
      return undefined
    },

    collect: (monitor) => ({
      hovered: monitor.isOver(),
      item: monitor.getItem()
    }),
  })

  React.useEffect(() => {
    if (!tempQueue && hovered) {
      addQueue(item.data.type, true)
    } else if (tempQueue && !hovered) {
      deleteQueue(tempQueue.index);
    }
  }, [item, addQueue, deleteQueue, tempQueue, hovered])

  return (
    <QueueForm>
      <QueueWrapper>
        <Card type="start" />
        <Queue ref={drop}>
          <SortCardList
            draggingIndex={draggingIndex}
            cards={[...queue, {
              type: 'temp',
              index: queue.length,
              temp: false,
            }]}
            updateCard={(index: number) => {
              if (tempQueue) {
                replaceQueue(tempQueue.index, index)
              }
            }}
            dropCard={() => reSortSetQueue(queue)}
            changeDraggingIndex={changeDraggingIndex}
            moveCard={replaceQueue}
            addingCard={(index: number) => {}}
          />
        </Queue>
      </QueueWrapper>
      <PlayBtn
        onTouchStart={() => setPushing(true)}
        onTouchEnd={() => setPushing(false)}
      >
        <PlayBtnWrapper pushing={pushing}>
          <img src={playImg} alt="play" />
        </PlayBtnWrapper>
      </PlayBtn>
    </QueueForm>
  )
}
