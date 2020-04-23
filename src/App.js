import React, { useState } from "react";
import Game from "./components/Game";
import "bootstrap/dist/css/bootstrap.min.css";

import config from "./config/config";
import StartMenu from "./components/StartMenu";
import LevelMenu from "./components/LevelMenu";
import LostMenu from "./components/LostMenu";
import WinMenu from "./components/WinMenu";
import Controls from "./components/Controls";

function App() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentView, setCurrentView] = useState(config.VIEW.START_MENU);

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
      case config.VIEW.CONTROLS:
        return <Controls {...{ setCurrentView }}></Controls>;
      default:
        throw Error("Invalid View: " + currentView);
    }
  }

  function getCurrentSong() {
    switch (currentView) {
      case config.VIEW.START_MENU:
        return config.SONGS.mainmenu;
      case config.VIEW.LEVEL_MENU:
        return config.SONGS.mainmenu;
      case config.VIEW.GAME:
        return config.SONGS.ingame;
      case config.VIEW.LOST:
        return config.SONGS.mainmenu;
      case config.VIEW.WIN:
        return config.SONGS.win;
      case config.VIEW.CONTROLS:
        return config.SONGS.mainmenu;
      default:
        throw Error("Invalid View: " + currentView);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#504030",
      }}
    >
      <div id="game"></div>
      {getView()}
      <audio
        ref={(ref) => {
          if (ref) ref.volume = 0.15;
        }}
        src={getCurrentSong()}
        autoPlay
        loop
      ></audio>
    </div>
  );
}

export default App;
