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

  React.useEffect(() => {
    // let allQueue = firebase.firestore().collection("quick-play-queue");
    // firebase.firestore().runTransaction(function (transaction) {
    //   // This code may get re-run multiple times if there are conflicts.
    //   return transaction.get(allQueue).then(function (sfDoc) {
    //     if (!sfDoc.exists) {
    //       console.log("Document does not exist!");
    //     }
    //     console.log(sfDoc);
    //   });
    // });
    // allQueue = allQueue.where("rule", "==", "6-win");
    // allQueue = allQueue.where("room_type", "==", "gomoku");
    // allQueue = allQueue.where("elo-level", "==", "nhap-mon");
    // allQueue.get().then((res) => {
    //   const nominee = res.docs.filter((value) => value.id !== "123")[0].data();
    //   console.log(nominee);
    // });
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

  const resetUser = (id) => {
    firebase
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
