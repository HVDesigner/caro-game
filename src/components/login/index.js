import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";
import { SET_USER_DATA } from "./../../context/ActionTypes";

function Login() {
  const StateGlobal = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);
  const { dispatch } = StateGlobal;

  const [id, setID] = React.useState("");
  const [name, setName] = React.useState("");
  const [userList, setUserList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get all users
    firebase
      .firestore()
      .collection("users")
      .get()
      .then(function (querySnapshot) {
        const arr = [];
        querySnapshot.forEach(function (doc) {
          arr.push({ uid: doc.id, ...doc.data() });
        });
        setUserList(arr);
        setLoading(false);
      });
  }, [firebase]);

  const setUserData = (value) => {
    dispatch({
      type: SET_USER_DATA,
      payload: value,
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    const newUserdata = {
      coin: 1000,
      elo: 1000,
      image_url: "",
      locale: "vi_VN",
      location: { path: "dashboard" },
      name: { value: name, status: "original" },
      room_id: { value: 0, type: "none" },
      setting: {
        sound: true,
        matchingByElo: true,
        language: { status: "original", value: "vn" },
      },
      "game-type-select": { value: "gomoku" },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    firebase
      .firestore()
      .collection("users")
      .doc(id)
      .set(newUserdata)
      .then(function () {
        dispatch({
          type: SET_USER_DATA,
          payload: { ...newUserdata, uid: id, platform: "web" },
        });
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  return (
    <Container className="bg-light pt-2" style={{ minHeight: "100vh" }}>
      {loading ? (
        <Row>
          <Col>
            <p className="text-center">Loading...</p>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            {userList.map((value) => {
              return (
                <Card key={value.uid} className="mb-1">
                  <Card.Body
                    className="d-flex"
                    onClick={() => {
                      setUserData(value);
                    }}
                  >
                    <p className="mb-0 mr-auto">
                      <strong>{value.name.value}</strong>
                    </p>
                    <p className="mb-0">{value.uid}</p>
                  </Card.Body>
                </Card>
              );
            })}
          </Col>
        </Row>
      )}
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
                autoComplete="off"
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
                autoComplete="off"
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
