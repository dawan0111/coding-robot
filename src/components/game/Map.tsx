import React from 'react'
import styled from 'styled-components'
import GameContext from '../../contexts/GameContext'

import MapIcon from './MapIcon'

const MapGrid = styled.div`
  display: flex;
  flex-wrap: wrap;

  width: 100%;
  height: 100%;

  & > div {
    width: 20%;
    height: 25%;
    background: #00c55a;

    &:nth-child(even) {
      background: #00ab4d;
    }
  }
`

const MapGridItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.active && (`
    border: 2px solid #ff9000;
  `)}
  // border: ${props => props.active ? "2px solid #ff9000" : "none"}

  .mapIcon {
    width: auto;
    height: 40%;
  }
`

type Props = {
  editable?: boolean
}

export default function Map({ editable = false }: Props) {
  const { map, activeMap, changeActiveMap } = React.useContext(GameContext)

  return (
    <MapGrid>
      {map.map((val, index) => (
        <MapGridItem active={editable && activeMap === index} key={index} onClick={() => {
          editable && changeActiveMap(activeMap === index ? -1 : index);
        }}>
          <MapIcon type={val} />
        </MapGridItem>
      ))}
    </MapGrid>
  )
}
