import styled from 'styled-components'

import MapIcon from './MapIcon'

import MapBgRight from '../../images/bg-right.png'
import { useRootSelector } from '../../hooks/useRootState'
import { shallowEqual, useDispatch } from 'react-redux'
import { activeOffset } from '../../stores/modules/map'


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
  const dispatch = useDispatch()
  const { map, mapX, mapY, active } = useRootSelector(state => ({
    map: state.map.data,
    mapX: state.map.x,
    mapY: state.map.y,
    active: state.map.active
  }), shallowEqual)

  return (
    <MapGrid x={mapX} y={mapY}>
      {map.map((val, index) => (
        <MapGridItem
          odd={(Math.floor(index / mapX) + index % mapX) % 2 === 1}
          active={editable && active === index}
          key={index}
          onClick={() => {
            editable && dispatch(activeOffset(active === index ? -1 : index));
          }}
        >
          <MapIcon type={val} />
        </MapGridItem>
      ))}
    </MapGrid>
  )
}
