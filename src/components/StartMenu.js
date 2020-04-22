import React from "react";
import { Button, Jumbotron } from "react-bootstrap";

import config from "../config/config";

function StartMenu({ setCurrentView }) {
  return (
    <div>
      <Jumbotron>
        <h1 style={{ textAlign: "center" }}>Project Incognito</h1>
        <Button
          onClick={() => setCurrentView(config.VIEW.LEVEL_MENU)}
          variant="outline-success"
          size="lg"
          block
        >
          PLAY
        </Button>
      </Jumbotron>
    </div>
  );
}

export default StartMenu;