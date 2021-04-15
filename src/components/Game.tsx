import React from "react";
import constate from "constate";
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'; 
import styled from 'styled-components'
import { GameContextProvider } from "../contexts/GameContext";
import useGame from '../hooks/useGame'
import AudioPlayerContext from "../contexts/AudioContext";
import Map from './game/Map';
import BluetoothButton from "./game/BluetoothButton";

import Control from "./game/Control";
import { CustomDragLayer } from "./game/CustomDragLayer";
import PlayButton from "./game/PlayButton";
import MapEditComponent from './game/MapEdit';
import MapEditControl from "./game/MapEditControl";
import ResultModal from "./game/ResultModal";

import playImg from '../images/play.svg';

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
  width: calc(60vh + 5vw);
  height: 56vh;

  background: #008399 ;
  border: .5rem solid #008399;

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

const [GameProvider, usePage, useChangePage] = constate(
  useGame,
  value => value.page,
  value => value.setPage
)

function GameStart() {
  const page = usePage()
  const changePage = useChangePage()
  const { play } = React.useContext(AudioPlayerContext)

  return (
    <>
      {
        page === "GAME_START" &&
        <StartWrapper>
          <PlayButton onClick={() => {
            changePage("GAME_PLAY")
            play("bgm", {
              loop: true
            })
          }}>
            <img src={playImg} alt="paly btn"/>
          </PlayButton>
        </StartWrapper>
      }
    </>
  )
}

function GamePlay() {
  const page = usePage()
  const changePage = useChangePage()

  return (
    <>
      {page === "GAME_PLAY" &&
        <Wrapper>
          <MapWrapper>
            <StatusBar>
              <BluetoothButton />
            </StatusBar>
            <MapScreen>
              <SettingButton onClick={() => {
                changePage("MAP_EDIT")
              }}>
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
  const page = usePage()
  const changePage = useChangePage()

  return (
    <>
      {
        page === "MAP_EDIT" &&
        <Wrapper>
          <BackButton onClick={() => {
            changePage("GAME_PLAY");
            // saveMap();
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
    <GameProvider>
      <GameContextProvider>
        <DndProvider options={HTML5toTouch}>
          <CustomDragLayer snapToGrid={false} />
          <GamePlay />
          <MapEdit />
          <GameStart />
        </DndProvider>
      </GameContextProvider>
    </GameProvider>
  )
}