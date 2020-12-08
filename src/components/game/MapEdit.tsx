import React from 'react'
import styled from 'styled-components'
import Map from './Map'

const MapEditWrapper = styled.div`
  width: 100vh;
  height: 80vh;
  margin: 0 auto;
`

export default function MapEdit() {
  return (
    <MapEditWrapper>
      <Map editable={true} />
    </MapEditWrapper>
  )
}
