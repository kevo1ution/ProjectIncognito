import React, { useState } from "react";
import Game from "./components/Game";
import "bootstrap/dist/css/bootstrap.min.css";

import config from "./config/config";
import StartMenu from "./components/StartMenu";
import LevelMenu from "./components/LevelMenu";
import LostMenu from "./components/LostMenu";
import WinMenu from "./components/WinMenu";
import useAudio from "./util/useAudio";

function App() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentView, setCurrentView] = useState(config.VIEW.START_MENU);
  const [songPlayers, toggleSong] = useAudio(config.SONGS.RAW);

  function playSong(song) {
    if (!songPlayers[song].playing) {
      toggleSong(song)();
    }
  }

  // play song based on current view
  switch (currentView) {
    case config.VIEW.START_MENU:
      playSong(config.SONGS.mainmenu);
      break;
    case config.VIEW.LEVEL_MENU:
      playSong(config.SONGS.mainmenu);
      break;
    case config.VIEW.GAME:
      playSong(config.SONGS.ingame);
      break;
    case config.VIEW.LOST:
      playSong(config.SONGS.mainmenu);
      break;
    case config.VIEW.WIN:
      playSong(config.SONGS.win);
      break;
    default:
      throw Error("Invalid View: " + currentView);
  }

  function getView() {
    switch (currentView) {
      case config.VIEW.START_MENU:
        return <StartMenu {...{ setCurrentView }}></StartMenu>;
      case config.VIEW.LEVEL_MENU:
        return (
          <LevelMenu {...{ setCurrentView, setSelectedLevel }}></LevelMenu>
        );
      case config.VIEW.GAME:
        return (
          <Game
            {...{
              setCurrentView,
              selectedLevel,
              setSelectedLevel,
            }}
          ></Game>
        );
      case config.VIEW.LOST:
        return <LostMenu {...{ setCurrentView }}></LostMenu>;
      case config.VIEW.WIN:
        return (
          <WinMenu
            {...{ setCurrentView, selectedLevel, setSelectedLevel }}
          ></WinMenu>
        );
      default:
        throw Error("Invalid View: " + currentView);
    }
  }

  return (
    // displayflex, justify content, align items, hieight 100, width 100
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#303030",
      }}
    >
      <div id="game"></div>
      {getView()}
    </div>
  );
}

export default App;
