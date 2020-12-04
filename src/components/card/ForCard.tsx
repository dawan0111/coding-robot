import React from 'react'
import styled from 'styled-components'
import forStartImg from '../../images/for-start.png'
import forEndImg from '../../images/for-end.png'
import { useDrop, XYCoord } from 'react-dnd'
import { card, cardSortEvent, draggableCard } from '../../types/card'
import { SortCardList } from './CardList'

const ForWrapper = styled.div`
  width: auto;
  display: flex;
  flex-wrap: nowrap;
`

const ForStack = styled.div`
  position: relative;
  min-width: 2rem;
  height: 100%;

  border-top: .25rem solid #ce81fe; 
`

const ForStart = styled.div`
  width: 0.6rem;
`

const ForEnd = styled.div`
  position: relative;
  width: 1.95rem;
`

const ForRangeInput = styled.input`
  position: absolute;
  left: 59%;
  bottom: 5%;

  width: 60%;
  height: .5rem;
  background: #fff;
  border: none;
  border-radius: 300px;
  transform: translateX(-50%);
  text-align: center;
  font-size: 0.25rem;

  &:focus {
    outline: none;
  }
`

type Props = {
  cardIndex?: number
}

export default function ForCard({ cardIndex }: Props) {
  return (
    <ForWrapper>
      <ForStart>
        <img src={forStartImg} alt="for문 시작"/>
      </ForStart>
      <ForStack>
        <SortCardList
          parent={cardIndex}
        />
      </ForStack>
      <ForEnd>
        <img src={forEndImg} alt="for문 끝"/>
        <ForRangeInput />
      </ForEnd>
    </ForWrapper>
  )
}