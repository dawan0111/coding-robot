import React from "react";
import styled from 'styled-components'

import startImg from '../../images/start.svg'
import leftRotateImg from '../../images/left-rotate.svg'
import rightRotateImg from '../../images/right-rotate.svg'
import goImg from '../../images/go.svg'
import { cardC } from "../../types/card";

const Item = styled.div`
  position: relative;
  width: 3.2rem;
  height: 3rem;
  font-size: 0;

  img {
    width: auto;
    height: 100%;
  }
`

export default React.forwardRef(function Card({ type, ...props }: cardC, ref) {
  return (
    <Item {...props}>
      {type === "start" && <img src={startImg} alt="시작 이미지" />}
      {type === "go" && <img src={goImg} alt="직진"/>}
      {type === "left-rotate" && <img src={leftRotateImg} alt="왼쪽으로 90도 회전"/>}
      {type === "right-rotate" && <img src={rightRotateImg} alt="오른쪽으로 90도 회전"/>}
    </Item>
  )
})