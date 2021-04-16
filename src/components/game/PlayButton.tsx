import React from 'react'
import PushButton from './PushButton'
import useGame from '../../hooks/useGame'
import playImg from '../../images/play.svg'

export default function PlayButton() {
  const game = useGame()
  return (
    <PushButton onClick={() => {
      game.runGame()
    }}>
      <img src={playImg} alt="play" />
    </PushButton>
  )
}
