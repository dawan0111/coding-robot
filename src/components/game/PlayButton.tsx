import { on } from 'process'
import React from 'react'
import styled from 'styled-components'

import playImg from '../../images/play.svg'

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

type Props = {
  onClick: () => void
}

export default function PlayButton({ onClick }: Props) {
  const [pushing, setPushing] = React.useState(false)

  return (
    <PlayBtn
      onTouchStart={(e) => {
        setPushing(true)
      }}
      onTouchEnd={(e) => {
        setPushing(false)
      }}
      onClick={() => onClick()}
    >
      <PlayBtnWrapper pushing={pushing}>
        <img src={playImg} alt="play" />
      </PlayBtnWrapper>
    </PlayBtn>
  )
}
