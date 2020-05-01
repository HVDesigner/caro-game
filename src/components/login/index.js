import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";
import {
  CHANGE_ROUTE,
  GET_ROOM_ID,
  SET_USER_INFO,
} from "./../../context/ActionTypes";

function Login() {
  const StateGlobal = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);
  const { dispatch } = StateGlobal;

  const [id, setID] = React.useState("");
  const [name, setName] = React.useState("");
  const [userList, setUserList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    function doSnapShot(snapshot) {
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());
        const arr = [];

        for (let index = 0; index < keys.length; index++) {
          const element = keys[index];

          arr.push({ ...snapshot.val()[element], id: element });
        }

        setUserList(arr);
        setLoading(false);
      }
    }

    firebase.database().ref("users").once("value").then(doSnapShot);
  }, [firebase]);

  const getUserInfo = (id, name, image_url, locale, platform) => {
    const userRef = firebase.database().ref("users/" + id);

    userRef.once("value").then((snapshot) => {
      if (snapshot.val()) {
        dispatch({
          type: CHANGE_ROUTE,
          payload: { path: snapshot.val().location.path },
        });

        dispatch({
          type: GET_ROOM_ID,
          payload: {
            id: snapshot.val().room_id.value,
            type: snapshot.val().room_id.type,
          },
        });

        // update image
        if (snapshot.val().image_url !== image_url) {
          userRef.update({ image_url });
        }

        // check name
        if (snapshot.val().name.status === "original") {
          dispatch({
            type: SET_USER_INFO,
            payload: {
              id,
              name,
              image_url,
              locale,
              coin: snapshot.val().coin,
              elo: snapshot.val().elo,
              platform,
            },
          });
        } else {
          dispatch({
            type: SET_USER_INFO,
            payload: {
              id,
              name: snapshot.val().name,
              image_url,
              locale,
              coin: snapshot.val().coin,
              elo: snapshot.val().elo,
              platform,
            },
          });
        }
      } else {
        // add new user
        userRef
          .set({
            coin: 1000,
            elo: 1000,
            image_url,
            name: { status: "original", value: name },
            locale,
            setting: {
              sound: true,
              language: {
                status: "original",
                value: locale === "vi_VN" ? "vn" : "en",
              },
              matchingByElo: true,
            },
            location: {
              path: "dashboard",
            },
            room_id: { value: 0, type: "none" },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .then(() => {
            dispatch({
              type: SET_USER_INFO,
              payload: {
                id,
                name,
                image_url,
                locale,
                platform,
              },
            });
          });
      }
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    getUserInfo(id, name, "", "vi_VN", "web");
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
            {userList.map((value, key) => (
              <Card key={key} className="mb-1">
                <Card.Body
                  className="d-flex"
                  onClick={() => {
                    getUserInfo(value.id, value.name.value, "", "vi_VN", "web");
                  }}
                >
                  <p className="mb-0 mr-auto">
                    <strong>{value.name.value}</strong>
                  </p>
                  <p className="mb-0">{value.id}</p>
                </Card.Body>
              </Card>
            ))}
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
