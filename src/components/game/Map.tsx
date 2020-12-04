import React from 'react'
import styled from 'styled-components'

const MapWrapper = styled.div`
  width: 40%;
  height: 80%;

  border-radius: 2rem;
  background: #999;
  border: .5rem solid #fff;

  padding-top: 1rem;

  & > img {
    width: auto;
    height: 100%;
  }
`

export default function Map() {
  return (
    <MapWrapper>
    </MapWrapper>
  )
}
