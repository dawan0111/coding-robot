import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import styled from 'styled-components'
import GameContext, { GameContextProvider } from "../contexts/GameContext";
import Map from './game/Map'
import BluetoothButton from "./game/BluetoothButton";

import Control from "./game/Control";
import { CustomDragLayer } from "./game/CustomDragLayer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 100%;

  background: #99eadf;
`

const MapWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`

const ControlWrapper = styled.div`
  width: 100%;
`

const StatusBar = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
`

function GamePlay() {
  const { page } = React.useContext(GameContext)
  return (
    <>
      {
        page === "game" &&
        <Wrapper>
          <MapWrapper>
            <StatusBar>
              <BluetoothButton />
            </StatusBar>
            <Map />
          </MapWrapper>
          <ControlWrapper>
            <Control />
          </ControlWrapper>
        </Wrapper>
      }
    </>
  )
}

function MapEdit() {
  const { page } = React.useContext(GameContext)

  return (
    <>
      {
        page === "mapEdit" &&
        <Wrapper>
          <MapWrapper>
            <StatusBar>
              <BluetoothButton />
            </StatusBar>
            <Map />
          </MapWrapper>
          <ControlWrapper>
            <Control />
          </ControlWrapper>
        </Wrapper>
      }
    </>
  )
}

export default function Game() {

  return (
    <GameContextProvider>
      <DndProvider backend={TouchBackend}>
        <CustomDragLayer snapToGrid={false} />
        <GamePlay />
        <MapEdit />
      </DndProvider>
    </GameContextProvider>
  )
}