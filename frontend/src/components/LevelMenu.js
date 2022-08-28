import React from "react";
import { Row, Col, Container, Button, Jumbotron } from "react-bootstrap";

import config from "../config/config";

function LevelMenu({ setCurrentView, setSelectedLevel }) {
  const numLevels = config.GAME.levelCount;
  const numCols = 3;

  const rows = [];
  for (let i = 0; i < numLevels / 3; i++) {
    const cols = [];

    for (let j = 0; j < numCols; j++) {
      const id = i * numCols + j + 1;

      cols.push(
        <Col key={id}>
          {id <= numLevels && (
            <Button
              onClick={() => {
                setSelectedLevel(id);
                setCurrentView(config.VIEW.GAME);
              }}
              variant="outline-success"
              size="lg"
              block
            >
              {id}
            </Button>
          )}
        </Col>
      );
    }

    rows.push(
      <Row key={i} style={{ padding: "10px" }}>
        {cols}
      </Row>
    );
  }

  return (
    <div>
      <Jumbotron
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <h1 style={{ textAlign: "center" }}>Levels</h1>
        <Container>{rows}</Container>
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

export default LevelMenu;
