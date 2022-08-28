import React from "react";
import { Badge, Button, Jumbotron } from "react-bootstrap";

import config from "../config/config";

function Controls({ setCurrentView }) {
  return (
    <div>
      <Jumbotron
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Controls</h1>
        <h4>
          <Badge variant="secondary">WASD</Badge> - Move character
        </h4>
        <h4>
          <Badge variant="secondary">F</Badge> - Use character ability
        </h4>
        <h4>
          <Badge variant="secondary">SPACE</Badge> - Switch characters
        </h4>
        <Button
          onClick={() => setCurrentView(config.VIEW.START_MENU)}
          variant="outline-secondary"
        >
          {"<="}
        </Button>
      </Jumbotron>
    </div>
  );
}

export default Controls;
