import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import useMap from '../../hooks/useMap'
import { update } from '../../stores/modules/map'
import { coins, isStartCoin } from '../../types/coin'
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
  const dispatch = useDispatch()
  const { x: mapX, y: mapY, active: activeMap, mapStartIndex, mapEndIndex } = useMap()

  return (
    <MapEditWrapper>
      {coins.filter((type) => (
        (type === "start-left" && activeMap % mapX !== 0) ||
        (type === "start-right" && activeMap % mapX !== mapX - 1) ||
        (type === "start-up" && activeMap > mapX - 1) ||
        (type === "start-down" && activeMap < (mapX - 1) * mapY) ||
        !isStartCoin(type) ||
        activeMap === -1
      )).map((type, index) => (
        <EditButton key={index} onClick={() => {
          if (isStartCoin(type) && mapStartIndex !== -1) {
            dispatch(update({
              index: mapStartIndex,
              coin: "empty"
            }))
          } else if (type === "end-point" && mapEndIndex !== -1) {
            dispatch(update({
              index: mapEndIndex,
              coin: "empty"
            }))
          }

          activeMap !== -1 && dispatch(update({
            index: activeMap,
            coin: type
          }))
        }}>
          {type === "empty" ? (
            <span className="material-icons">delete</span>
          ) : (<MapIcon type={type} />)}
        </EditButton>
      ))}
    </MapEditWrapper>
  )
}
