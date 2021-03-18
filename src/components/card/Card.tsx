import React from "react";
import styled from 'styled-components'

import startImg from '../../images/start.svg'
import leftRotateImg from '../../images/left-rotate.png'
import rightRotateImg from '../../images/right-rotate.png'
import goImg from '../../images/go.png'
import { cardC } from "../../types/card";
import ForCard from "./ForCard";

const Item = styled.div<{ active: boolean }>`
  position: relative;
  height: 2.45rem;
  font-size: 0;

  ${props => props.active && `
    z-index: 1000;
    box-shadow: 0 0 5px 2px #fff;
  `}

  > div {
    height: 100%;
  }

  img {
    width: auto;
    height: 100%;
  }

  &.for {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: auto;
  }
`

export default React.forwardRef(function Card({
  type,
  cardIndex,
  active = false,
  temp = false,
  ...props 
}: cardC, ref) {

  return (
    <Item {...props} active={active} className={`${type} item`}>
      {type === "start" && <img src={startImg} alt="시작 이미지" />}
      {type === "go" && <img src={goImg} alt="직진"/>}
      {type === "left-rotate" && <img src={leftRotateImg} alt="왼쪽으로 90도 회전"/>}
      {type === "right-rotate" && <img src={rightRotateImg} alt="오른쪽으로 90도 회전"/>}
      {type === "for" && (
        <ForCard
          cardIndex={cardIndex}
          temp={temp}
        />
      )}
    </Item>
  )
})