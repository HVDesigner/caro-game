import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import AppContext from "./../../context/";

function Login() {
  const StateGlobal = React.useContext(AppContext);
  const { setUserInfo } = StateGlobal;

  const [id, setID] = React.useState("");
  const [name, setName] = React.useState("");

  const submitForm = (e) => {
    e.preventDefault();
    setUserInfo(id, name, "");
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3 className="mt-3">Login</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={submitForm}>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter id"
                value={id}
                onChange={(e) => {
                  setID(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" block>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
