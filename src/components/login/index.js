import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import {
  useFirestoreCollection,
  useFirestore,
  useFirebaseApp,
} from "reactfire";
import firebase from "firebase/app";
import moment from "moment";
import "moment/locale/vi";

// Contexts
import AppContext from "./../../context/";

// Action Types
import { SET_USER_DATA } from "./../../context/ActionTypes";

// SVG
import UserSVG from "./../../assets/Dashboard/user.svg";

function Login() {
  const { dispatch } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

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
      coin: 5000,
      "login-time": {
        "login-at": firebase.firestore.FieldValue.serverTimestamp(),
        value: 1,
      },
      elo: { gomoku: 1000, "block-head": 1000 },
      image_url: "image",
      locale: "vi_VN",
      location: { path: "dashboard" },
      name: { value: name, status: "original", cost: 500 },
      room_id: { value: 0, type: "none" },
      setting: {
        music: { background: true, effect: true },
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
      like: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    firebaseApp
      .firestore()
      .collection("users")
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
    firebaseApp
      .firestore()
      .collection("users")
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
                    className="d-flex align-items-center"
                    onClick={() => {
                      setUserData(value);
                    }}
                  >
                    <img
                      src={
                        value.image_url === "image" ? UserSVG : value.image_url
                      }
                      alt="ava"
                      className={
                        value.image_url === "image"
                          ? "mr-2"
                          : "rounded-circle mr-2 border"
                      }
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="mr-auto">
                      <p className="mb-0">
                        <strong>{value.name.value}</strong>
                      </p>
                      <p className="mb-0">
                        {moment(value["login-time"]["login-at"].toDate())
                          .locale("vi")
                          .fromNow()}
                      </p>
                    </div>
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
