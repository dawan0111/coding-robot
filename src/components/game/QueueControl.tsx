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
  display: flex;
  flex: 1;
  font-size: 0;
`

export default function QueueControl() {
  const { sendQueueData } = React.useContext(GameContext)
  
  return (
    <QueueForm>
      <QueueWrapper>
        <Card type="start" />
        <Queue>
          <SortCardList />
        </Queue>
      </QueueWrapper>
      <PlayButton onClick={() => sendQueueData()} />
    </QueueForm>
  )
}
