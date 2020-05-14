import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useFirestoreCollection, useFirestore } from "reactfire";
import firebase from "firebase/app";

// Contexts
import AppContext from "./../../context/";

// Action Types
import { SET_USER_DATA } from "./../../context/ActionTypes";

function Login() {
  const StateGlobal = React.useContext(AppContext);
  const { dispatch } = StateGlobal;

  const [idState, setIDState] = React.useState("");
  const [name, setName] = React.useState("");
  const [userListState, setUserListState] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  /**
   * Users Collection khởi tạo.
   */
  const userCollectionFirestore = useFirestore().collection("users");

  /**
   * Lấy danh sách users.
   */
  const userListFirestore = useFirestoreCollection(userCollectionFirestore);

  React.useEffect(() => {
    const arr = [];

    userListFirestore.forEach(function (doc) {
      arr.push({ uid: doc.id, ...doc.data() });
    });

    setUserListState(arr);
    setLoading(false);
  }, [userListFirestore]);

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
      elo: { gomoku: 1000, "block-head": 1000 },
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
      game: {
        win: { gomoku: 0, "block-head": 0 },
        lost: { gomoku: 0, "block-head": 0 },
        tie: { gomoku: 0, "block-head": 0 },
      },
      on_queue: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    userCollectionFirestore
      .doc(idState)
      .set(newUserdata)
      .then(function () {
        dispatch({
          type: SET_USER_DATA,
          payload: { ...newUserdata, uid: idState, platform: "web" },
        });
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const resetUser = (id) => {
    userCollectionFirestore
      .doc(id)
      .update({
        "location.path": "dashboard",
        "room_id.value": 0,
        "room_id.type": "none",
      })
      .then(() => {
        console.log("reset done");
      });
  };

  return (
    <Container className="bg-light pt-2" style={{ minHeight: "100vh" }}>
      {loading ? (
        <Row>
          <Col>
            <p>Loading</p>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            {userListState.map((value) => {
              return (
                <Card key={value.uid} className="mb-2">
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
                  <Card.Footer>
                    <Button
                      variant="primary"
                      type="submit"
                      block
                      onClick={() => {
                        resetUser(value.uid);
                      }}
                    >
                      Reset
                    </Button>
                  </Card.Footer>
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
          <Form onSubmit={submitForm} className="mb-5">
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter id"
                value={idState}
                onChange={(e) => {
                  setIDState(e.target.value);
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
