import React from "react";
import { Row, Col, Container, Button, Jumbotron } from "react-bootstrap";

import config from "../config/config";

function LostMenu({ setCurrentView, reason }) {
  let deathMsg = "";
  switch (reason) {
    case config.GAME.characters.death.FALL:
      deathMsg = "You Fell to Death!";
      break;
    case config.GAME.characters.death.GUARD:
      deathMsg = "You Got Caught by a Guard!";
      break;
    case config.GAME.characters.death.TOWER:
      deathMsg = "You Got Caught by a Tower!";
      break;
    default:
      deathMsg = "You Lost!";
  }

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
        <div>
          <img
            src="assets/demolisherTombstone.png"
            width="88vw"
            height="auto"
            alt="demolisher is dead"
          ></img>
          <img
            width="100vw"
            height="auto"
            src="assets/scoutTombstone.png"
            alt="scout is dead"
          ></img>
          <img
            width="94vw"
            height="auto"
            src="assets/reconTombstone.png"
            alt="recon is dead"
          ></img>
        </div>
        <h1>{deathMsg}</h1>
      </Jumbotron>
      <Container style={{ padding: "10px" }}>
        <Row>
          <Col>
            <Button
              onClick={() => {
                setCurrentView(config.VIEW.LEVEL_MENU);
              }}
              variant="outline-light"
            >
              {"<="}
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                setCurrentView(config.VIEW.GAME);
              }}
              variant="outline-warning"
            >
              restart
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LostMenu;
