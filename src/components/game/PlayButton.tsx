import { on } from 'process'
import React from 'react'
import styled from 'styled-components'

const PlayBtn = styled.div`
  position: relative;
  z-index: 2;
  width: 3.5rem;
  height: 3.5rem;
  margin-right: .5rem;
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

const PlayBtnWrapper = styled.div<{pushing: boolean, reset?: boolean}>`
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

  ${props => props.reset && (`
    img {
      width: 50%;
    }
  `)}
`

type Props = {
  onClick: () => void
  children?: React.ReactNode
  reset?: boolean
}

export default function PlayButton({ onClick, reset, children }: Props) {
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
      <PlayBtnWrapper reset={reset} pushing={pushing}>
        {children}
      </PlayBtnWrapper>
    </PlayBtn>
  )
}
