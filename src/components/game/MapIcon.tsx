import React from 'react'
import carrotImage from '../../images/carrot.svg'
import rabbitImage from '../../images/rabbit.svg'
import { coinT, isStartCoin } from '../../types/coin'

type Props = {
  type: coinT,
}

function getRotate(type: coinT) {
  switch (type) {
    case "start-right":
      return 180;
    case "start-down":
      return 270;
    case "start-up":
      return 90;
    default:
      return 0;
  }
}

export default function MapIcon({ type }: Props) {
  return (
    <>
      {type === "carrot" && <img src={carrotImage} alt="당근" className="mapIcon" />}
      {isStartCoin(type) && (
        <div style={{
          position: "relative",
          zIndex: 5,
          width: '100%',
          height: '100%',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span className="material-icons" style={{
            position: "absolute",
            left: "50%",
            top: "80%",
            transform: `translate(-50%, -50%) rotate(${getRotate(type)}deg)`,

          }} >keyboard_backspace</span>
          <img src={rabbitImage} alt="시작점" className="mapIcon"/>
        </div>
      )}
    </>
  )
}
