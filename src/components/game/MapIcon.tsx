import React from 'react'
import carrotImage from '../../images/carrot.svg'
import rabbitImage from '../../images/rabbit.png'
import { coinT } from '../../types/coin'

type Props = {
  type: coinT,
}

export default function MapIcon({ type }: Props) {
  return (
    <>
      {type === "carrot" && <img src={carrotImage} alt="당근" />}
      {type === "start" && <img src={rabbitImage} alt="시작점" />}
    </>
  )
}
