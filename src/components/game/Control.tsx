import React from "react";
import styled from 'styled-components'

import { useDrop } from 'react-dnd'

import { cardType, draggableCard } from "../../types/card";

import DraggableCard from "../card/DraggableCard";
import QueueControl from "./QueueControl";
import GameContext from "../../contexts/GameContext";
import AudioPlayerContext from "../../contexts/AudioContext";
import useQueue from "../../hooks/useQueue";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`

const QueueControlWrapper = styled.div`
  width: 100%;
  bottom: 100%;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, .5);

  width: 100%;
  padding-top: .5rem;
  padding-bottom: .5rem;
  background: rgba(0, 0, 0, .1);

  & > div {
    margin-left: .5rem;
    margin-right: .5rem;
  }
`

const usingCards: Array<cardType> = ["go", "left-rotate", "right-rotate", "for"]

export default function Control() {
  const { removeQueue } = useQueue()
  const { play } = React.useContext(AudioPlayerContext)
  
  const [, drop] = useDrop({
    accept: "sortCard",
    drop(item: draggableCard) {
      play("drop")
      removeQueue(item.index);
      return undefined
    },
  })

  return (
    <Wrapper>
      <QueueControlWrapper>
        <QueueControl />
      </QueueControlWrapper>
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