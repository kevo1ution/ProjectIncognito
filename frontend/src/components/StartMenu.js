import React from "react";
import { Button, Jumbotron } from "react-bootstrap";

import config from "../config/config";

function StartMenu({ setCurrentView }) {
  return (
    <div>
      <Jumbotron>
        <h1 style={{ textAlign: "center" }}>PROJECT INCOGNITO</h1>
        <Button
          onClick={() => setCurrentView(config.VIEW.LEVEL_MENU)}
          variant="outline-success"
          size="lg"
          block
        >
          PLAY
        </Button>
        <Button
          onClick={() => setCurrentView(config.VIEW.CONTROLS)}
          variant="outline-secondary"
          size="lg"
          block
        >
          Controls
        </Button>
      </Jumbotron>
    </div>
  );
}

export default StartMenu;
