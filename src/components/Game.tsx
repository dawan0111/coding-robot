import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import styled from 'styled-components'
import { GameContextProvider } from "../contexts/GameContext";
import BluetoothButton from "./game/BluetoothButton";

import Control from "./game/Control";
import { CustomDragLayer } from "./game/CustomDragLayer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100vw;
  height: 100vh;

  background: #99eadf;
`

const MapWrapper = styled.div`
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

export default function Game() {

  return (
    <GameContextProvider>
      <DndProvider backend={TouchBackend}>
        <CustomDragLayer snapToGrid={false} />
        <Wrapper>
          <MapWrapper>
            <StatusBar>
              <BluetoothButton />
            </StatusBar>
          </MapWrapper>
          <ControlWrapper>
            <Control />
          </ControlWrapper>
        </Wrapper>
      </DndProvider>
    </GameContextProvider>
  )
}