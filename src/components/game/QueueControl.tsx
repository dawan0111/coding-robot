import React from 'react'
import styled from 'styled-components'
import GameContext from '../../contexts/GameContext'
import Card from '../card/Card'


import { SortCardList } from '../card/CardList'
import PlayButton from './PlayButton'

const QueueForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  margin-top: 1rem;
  margin-bottom: 1rem;
`

const QueueWrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  width: 60%;
  overflow: hidden;

  box-shadow: inset 1px 1px 1px rgba(0, 0, 0, .5);
  border-radius: 100rem;

  padding-top: .5rem;
  padding-bottom: .5rem;
  padding-left: 1rem;
  margin-right: 1rem;

  background: #72d4c7;
`

const QueueScrollControl = styled.button<{isLeft?: boolean}>`
  position: absolute;
  z-index: 1001;
  top: 0;
  ${props => props.isLeft ? `left: 0;` : `right: 0;`}
  width: 8%;
  height: 100%;
  background: rgba(0, 0, 0, .2);
  color: #fff;
  border: none;
`

const Queue = styled.div`
  display: flex;
  flex: 1;
  font-size: 0;
  overflow-x: auto;
`

export default function QueueControl() {
  const { sendQueueData } = React.useContext(GameContext)
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current !== null) {
      console.log(ref.current.scrollLeft);
    }
  }, [ref])

  return (
    <QueueForm>
      <QueueWrapper>
        <QueueScrollControl
          onTouchStart={() => {
            if (ref.current) ref.current.scrollLeft -= 10;
          }}
          isLeft={true}
        >
          <span className="material-icons">keyboard_arrow_left</span>
        </QueueScrollControl>
        <Card type="start" />
        <Queue ref={ref}>
          <SortCardList />
        </Queue>
        <QueueScrollControl 
          onTouchStart={() => {
            if (ref.current) ref.current.scrollLeft += 10;
          }}
        >
          <span className="material-icons">keyboard_arrow_right</span>
        </QueueScrollControl>
      </QueueWrapper>
      <PlayButton onClick={() => sendQueueData()} />
    </QueueForm>
  )
}
