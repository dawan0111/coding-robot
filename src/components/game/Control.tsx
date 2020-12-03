import React from "react";
import styled from 'styled-components'

import { useDrop } from 'react-dnd'

import { card, cardType, draggableCard } from "../../types/card";

import DraggableCard from "../card/DraggableCard";
import QueueControl from "./QueueControl";
import GameContext from "../../contexts/GameContext";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, .5);

  width: 100%;
  padding-top: .5rem;
  padding-bottom: .5rem;
  background: #48baa4;

  & > div {
    margin-left: .2rem;
    margin-right: .2rem;
  }
`

const usingCards: Array<cardType> = ["go", "left-rotate", "right-rotate"]

export default function Control() {
  const { deleteNextQueue } = React.useContext(GameContext)
  const [, drop] = useDrop({
    accept: "sortCard",
    drop(item: draggableCard) {
      deleteNextQueue(item.index);
      return undefined
    },
  })

  return (
    <Wrapper>
      <QueueControl />
      <ItemWrapper ref={drop}>
        {usingCards.map((card, k) => (
          <DraggableCard
            val={k}
            type={card}
            key={k}
          />
        ))}
      </ItemWrapper>
    </Wrapper>
  )
}