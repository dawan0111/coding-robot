import React from "react";
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'; 
import styled from 'styled-components'
import GameContext, { GameContextProvider } from "../contexts/GameContext";
import Map from './game/Map'
import BluetoothButton from "./game/BluetoothButton";

import Control from "./game/Control";
import { CustomDragLayer } from "./game/CustomDragLayer";
import AudioPlayerContext from "../contexts/AudioContext";
import PlayButton from "./game/PlayButton";
import MapEditComponent from './game/MapEdit'
import MapEditControl from "./game/MapEditControl";
import ResultModal from "./game/ResultModal";

const Wrapper = styled.div`
  position: relative;
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

const MapScreen = styled.div`
  position: relative;
  width: calc(70vh + 5vw);
  height: 56vh;

  background: #fff ;
  border: .5rem solid #fff;

  & > img {
    width: auto;
    height: 100%;
  }
`

const SettingButton = styled.button`
  position: absolute;
  z-index: 1001;
  right: -1rem;
  top: -1rem;

  width: 2rem;
  height: 2rem;
  border-radius: .5rem;
  background: #f6941b;
  border: none;

  color: #fff;

  span {
    font-size: 1rem;
  }
`

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;

  background: none;
  border: none;

  span {
    font-size: 2rem;
  }
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
  const { page, changePage } = React.useContext(GameContext)
  return (
    <>
      {
        page === "game" &&
        <Wrapper>
          <MapWrapper>
            <StatusBar>
              <BluetoothButton />
            </StatusBar>
            <MapScreen>
              <SettingButton onClick={() => changePage("mapEdit")}>
                <span className="material-icons">settings</span>
              </SettingButton>
              <Map />
            </MapScreen>
          </MapWrapper>
          <ControlWrapper>
            <Control />
          </ControlWrapper>
        </Wrapper>
      }

      <ResultModal />
    </>
  )
}

function MapEdit() {
  const { page, changePage, saveMap } = React.useContext(GameContext)

  return (
    <>
      {
        page === "mapEdit" &&
        <Wrapper>
          <BackButton onClick={() => {
            changePage("game");
            saveMap();
          }}><span className="material-icons">keyboard_backspace</span></BackButton>
          <MapEditComponent />
          <MapEditControl />
        </Wrapper>
      }
    </>
  )
}

export default function Game() {
  return (
    <GameContextProvider>
      <DndProvider options={HTML5toTouch}>
        <CustomDragLayer snapToGrid={false} />
        <GamePlay />
        <MapEdit />
        <GameStart />
      </DndProvider>
    </GameContextProvider>
  )
}