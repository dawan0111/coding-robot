import React from 'react'
import styled from 'styled-components'
import GameContext from '../../contexts/GameContext'
import { coins, coinT, isStartCoin } from '../../types/coin'
import MapIcon from './MapIcon'

const MapEditWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20vh;
`

const EditButton = styled.button`
  height: 100%;
  background: none;
  border: none;

  margin: 0 1rem;

  color: #e91e63;

  & span {
    font-size: 2rem;
  }

  & img {
    height: 50%;
  }
`

export default function MapEdit() {
  const { activeMap, updateMap, mapStartIndex } = React.useContext(GameContext)

  return (
    <MapEditWrapper>
      {coins.filter((type) => (
        (type === "start-left" && activeMap % 5 !== 0) ||
        (type === "start-right" && activeMap % 5 !== 4) ||
        (type === "start-up" && activeMap > 4) ||
        (type === "start-down" && activeMap < 15) ||
        !isStartCoin(type) ||
        activeMap === -1
      )).map((type, index) => (
        <EditButton key={index} onClick={() => {
          if (isStartCoin(type) && mapStartIndex !== -1) {
            updateMap(mapStartIndex, "empty")  
          }
          activeMap !== -1 && updateMap(activeMap, type)
        }}>
          {type === "empty" ? (
            <span className="material-icons">delete</span>
          ) : (<MapIcon type={type} />)}
        </EditButton>
      ))}
    </MapEditWrapper>
  )
}
