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
import AudioPlayerContext from "../contexts/AudioContext";
import PlayButton from "./game/PlayButton";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 100%;
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

const StartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

function GameStart() {
  const { page, changePage } = React.useContext(GameContext)
  const { play } = React.useContext(AudioPlayerContext)

  return (
    <>
      {
        page === "gameStart" &&
        <StartWrapper>
          <PlayButton onClick={() => {
            changePage("game")
            play("bgm", {
              loop: true
            })
          }} />
        </StartWrapper>
      }
    </>
  )
}


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
        <GameStart />
      </DndProvider>
    </GameContextProvider>
  )
}