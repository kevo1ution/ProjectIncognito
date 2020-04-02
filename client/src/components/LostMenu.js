import React from "react";
import { Row, Col, Container, Button, Jumbotron } from "react-bootstrap";

import config from "../config/config";

function LostMenu({ setCurrentView }) {
  return (
    <div>
      <Jumbotron>
        <h1>You Got Caught!</h1>
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
