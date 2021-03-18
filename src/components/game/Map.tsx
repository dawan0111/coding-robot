import React from 'react'
import styled from 'styled-components'
import GameContext from '../../contexts/GameContext'

import MapIcon from './MapIcon'

import MapBgRight from '../../images/bg-right.png'


const MapGrid = styled.div<{ x: number, y: number }>`
  position: relative;
  display: flex;
  flex-wrap: wrap;

  width: calc(100% - 5vw);
  height: 100%;

  &:after {
    position: absolute;
    top: 0;
    left: 100%;
    width: 5vw;
    height: 100%;
    background-color: #fff;
    background: url(${MapBgRight}) no-repeat left top / auto 100%;
    content: "";
  }

  & > div {
    ${props => (`
      width: ${Math.floor(100 / props.x)}%;
      height: ${Math.floor(100 / props.y)}%;
    `)}
  }
`

const MapGridItem = styled.div<{ active: boolean, odd: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #22CBFF;

  ${props => props.active && (`
    border: 2px solid #ff9000;
  `)}

  ${props => props.odd && (`
    background: #00B3DD;
  `)}
  // border: ${props => props.active ? "2px solid #ff9000" : "none"}

  .mapIcon {
    width: auto;
    height: 60%;
  }
`

type Props = {
  editable?: boolean
}

export default function Map({ editable = false }: Props) {
  const { map, mapX, mapY, activeMap, changeActiveMap } = React.useContext(GameContext)

  return (
    <MapGrid x={mapX} y={mapY}>
      {map.map((val, index) => (
        <MapGridItem
          odd={(Math.floor(index / mapX) + index % mapX) % 2 === 1}
          active={editable && activeMap === index}
          key={index}
          onClick={() => {
            editable && changeActiveMap(activeMap === index ? -1 : index);
          }}
        >
          <MapIcon type={val} />
        </MapGridItem>
      ))}
    </MapGrid>
  )
}
