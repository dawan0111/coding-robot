import React from 'react'
import styled from 'styled-components'
import { card, cardSortEvent } from '../../types/card'
import Card from './Card'
import SortableCard from './SortableCard'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  font-size: 0;
`

type Props = {
  cards: Array<card>,
}

type SortProps = {
  draggingIndex: number
} & cardSortEvent & Props

export function SortCardList({ cards, draggingIndex, ...props }: SortProps) {
  return (
    <Wrapper>
      {cards.map((val, k) => (
        <div
          key={val.index}
          style={{
            position: 'relative',
            opacity: val.temp ? 0.5 : 1,
          }}
        >
          <SortableCard
            {...props}
            withDragging={val.index >= draggingIndex}
            type={val.type}
            index={k}
          />
        </div>
      ))}
    </Wrapper>
  )
}

export default function CardList({ cards }: Props) {
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
            type={val.type}
          />
        </div>
      ))}
    </Wrapper>
  )
}
