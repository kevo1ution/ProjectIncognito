import React, { useState } from "react";
import Game from "./Game";
import "bootstrap/dist/css/bootstrap.min.css";

import config from "./config/config";
import StartMenu from "./components/StartMenu";
import LevelMenu from "./components/LevelMenu";

function App() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentView, setCurrentView] = useState(config.VIEW.START_MENU);

  function getView() {
    switch (currentView) {
      case config.VIEW.START_MENU:
        return <StartMenu {...{ setCurrentView }}></StartMenu>;
      case config.VIEW.LEVEL_MENU:
        return <LevelMenu {...{ setCurrentView, setSelectedLevel }}></LevelMenu>;
      case config.VIEW.GAME:
        return <Game {...{ setCurrentView, selectedLevel }}></Game>;
    }
  }

  return (
    // displayflex, justify content, align items, hieight 100, width 100
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#303030"
      }}
      id="game"
    >
      {getView()}
    </div>
  );
}

export default App;
